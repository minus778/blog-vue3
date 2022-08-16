//登录模块逻辑部分
import { loginType } from '@/network/api/user/UserModel'
import { getCurrentInstance } from 'vue'
import { useStore } from '@/store/index'
import { useRouter, useRoute } from 'vue-router'
export default function useLogin(formLabel: loginType) {
    const { proxy } = getCurrentInstance() as any
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    //登录请求
    const login = () => {
        //调用子组件的表单验证就用proxy.$refs.loginFormRef.validate,如果是调用自身组件的表单验证就用loginFormRef.validate
        proxy.$refs.loginFormRef.validate(async (valid: boolean) => {
            console.log('表单验证是否通过', valid)
            //表单验证通过就发请求获取登录数据
            if (valid) {
                //仓库进行登录请求
                store.dispatch('user/loginBlog', formLabel).then(async res => {
                    //登录成功跳转到首页
                    if (res.code === 200) {
                        ElMessage({
                            message: res.msg,
                            type: 'success'
                        })
                        //登录成功发请求获取初始化的仓库数据（和app.vue的相互配合）
                        await store.dispatch('articles/getArticleList')
                        await store.dispatch('categories/getCategoriesList')
                        await store.dispatch('tags/getTagList')
                        await store.dispatch('comments/getCommentList')
                        //如果存在重定向url就跳转到重定向地址
                        if (route.query.redirectUrl) {
                            if (route.query.editArticleId) {
                                router.replace({ path: route.query.redirectUrl as string, query: { editArticleId: route.query.editArticleId } })
                            } else {
                                router.replace({ path: route.query.redirectUrl as string })
                            }
                        } else {
                            //没有重定向地址就跳转到首页
                            router.replace({ path: '/' })
                        }
                    }
                    //登录失败
                    if (res.code === 404) {
                        ElMessage.error(res.msg)
                    }
                }).catch(error => {
                    console.log('登录出错:', error);
                })
            }
        })
    }
    return {
        login
    }
}