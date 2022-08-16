//配置封装axios
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse }
    from "axios";
import qs from 'qs';
import router from '@/router'
//定义返回值类型
export interface Result<T = any> {
    code: number;
    msg: string;
    data?: T;
}
//枚举定义状态码
export enum StatusCode {
    NoAuth = 401, //token失效
    Success = 200 //返回成功
}
//封装一个类来创建axios实例及配置，外界直接new这个类然后传递config配置项就可以创建axios实例
class request {
    //定义axios实例
    private instance: AxiosInstance;
    constructor(config: AxiosRequestConfig) {
        //创建axios实例，config是一个包含实例配置信息的对象
        // {
        //     baseURL:'/api',
        //     timeout: 5000,
        // }
        this.instance = axios.create(config)
        //调用拦截器
        this.interceptors()
    }
    //axios拦截器
    private interceptors() {
        //请求拦截器
        this.instance.interceptors.request.use((config: AxiosRequestConfig) => {
            let token = localStorage.getItem('blogToken')
            let whiteList = ['/login', '/deleteUploadImg', '/uploadImg']
            //如果token存在且不为登录或上传/删除图片请求就在请求头携带token验证token是否失效
            if (whiteList.indexOf(config.url as string) === -1) {
                //token存在就在请求头带上然后后端判断token是否过期
                if (token) {
                    //ts不能使用未定义属性所以使用下面这种形式加上token请求头
                    config.headers = {
                        ...config.headers,
                        token: token
                    }
                    return config;
                } else {
                    //除非用户手动删除localStorage，不然一般情况下不会出现这种情况
                    //发请求但是token不存在就直接跳转到登录页进行登录重新获取token,确保除登录外的每个请求都能带上token
                    ElMessage({
                        message: '身份凭证无效，请重新登录',
                        type: 'warning'
                    })
                    localStorage.removeItem('blogMes')
                    //获取跳转前的路由路径
                    let redirectUrl = window.location.pathname
                    let queryData = window.location.search
                    if (queryData != '') {
                        let id = Number(queryData.split('=')[1])
                        //跳转到登录页并携带重定向路径参数(带编辑文章id)
                        router.replace({
                            path: "/login",
                            query: { redirectUrl, editArticleId: id }
                        })
                    } else {
                        //跳转到登录页并携带重定向路径参数
                        router.replace({
                            path: "/login",
                            query: { redirectUrl }
                        })
                    }
                }
            } else {
                //登录请求不做处理
                return config;
            }
        }, (error) => {
            // 错误抛到业务代码
            error.data = {}
            error.data.msg = '服务器异常'
            return error
        })
        /**
        * 响应拦截器
        * res的类型是AxiosResponse<any>
        */
        this.instance.interceptors.response.use((res: AxiosResponse) => {
            if (res && res.data) {
                //token过期
                if (res.data.code === StatusCode.NoAuth) {
                    console.log('token已失效');
                    ElMessage({
                        message: '身份凭证已失效，请重新登录',
                        type: 'warning'
                    })
                    //token失效清除用户信息退回登录界面并携带当前路由参数方便重新登录后回跳
                    localStorage.removeItem('blogToken')
                    localStorage.removeItem('blogMes')
                    //获取跳转前的路由路径
                    let redirectUrl = window.location.pathname
                    let queryData = window.location.search
                    if (queryData != '') {
                        let id = Number(queryData.split('=')[1])
                        //跳转到登录页并携带重定向路径参数(带编辑文章id)
                        router.replace({
                            path: "/login",
                            query: { redirectUrl, editArticleId: id }
                        })
                    } else {
                        //跳转到登录页并携带重定向路径参数
                        router.replace({
                            path: "/login",
                            query: { redirectUrl }
                        })
                    }
                }
                return res.data
            }
        }, (error) => { // 这里是遇到报错的回调
            console.log('进入请求错误回调')
            error.data = {};
            if (error && error.response) {
                switch (error.response.status) {
                    case 400:
                        error.data.msg = '错误请求';
                        ElMessage.error(error.data.msg)
                        break
                    case 401:
                        error.data.msg = '未授权，请重新登录';
                        ElMessage.error(error.data.msg)
                        break
                    case 403:
                        error.data.msg = '拒绝访问';
                        ElMessage.error(error.data.msg)
                        break
                    case 404:
                        error.data.msg = '请求错误,未找到该资源';
                        ElMessage.error(error.data.msg)
                        break
                    case 405:
                        error.data.msg = '请求方法未允许';
                        ElMessage.error(error.data.msg)
                        break
                    case 408:
                        error.data.msg = '请求超时';
                        ElMessage.error(error.data.msg)
                        break
                    case 500:
                        error.data.msg = '服务器端出错';
                        ElMessage.error(error.data.msg)
                        break
                    case 501:
                        error.data.msg = '网络未实现';
                        ElMessage.error(error.data.msg)
                        break
                    case 502:
                        error.data.msg = '网络错误';
                        ElMessage.error(error.data.msg)
                        break
                    case 503:
                        error.data.msg = '服务不可用';
                        ElMessage.error(error.data.msg)
                        break
                    case 504:
                        error.data.msg = '网络超时';
                        ElMessage.error(error.data.msg)
                        break
                    case 505:
                        error.data.msg = 'http版本不支持该请求';
                        ElMessage.error(error.data.msg)
                        break
                    default:
                        error.data.msg = `连接错误${error.response.status}`;
                        ElMessage.error(error.data.msg)
                }
            } else {
                error.data.msg = "连接到服务器失败";
                ElMessage.error(error.data.msg)
            }
            // return Promise.reject(error)
            return error
        })
    }

    //封装axios的get请求(泛型T为约束的返回对象中data属性的类型)
    get<T = any>(url: string, parms?: any): Promise<Result<T>> {
        return new Promise((resolve, reject) => {
            //axios.get(url,[,config])
            this.instance.get<T>(url, {
                //params类型参数，后端query接收
                params: parms,
                //qs.stringify(parms)将对象形式参数转换为字符串格式（qs序列化）
                paramsSerializer: (parms) => {
                    return qs.stringify(parms)
                }
            }).then((res) => {
                //返回请求回来的参数
                resolve(res as any)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    //封装axios的post请求
    post<T = any>(url: string, parms: any): Promise<Result<T>> {
        return new Promise((resolve, reject) => {
            //axios.post(url,[,data,[config]])
            this.instance.post<T>(url, parms, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                resolve(res as any)
            }).catch((error) => {
                reject(error)
            })
        })
    }
    //封装axios的上传图片请求
    uploadImg<T = any>(url: string, parms: any): Promise<Result<T>> {
        return new Promise((resolve, reject) => {
            //axios.post(url,[,data,[config]])
            this.instance.post<T>(url, parms, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                resolve(res as any)
            }).catch((error) => {
                reject(error)
            })
        })
    }
}
export default request;
