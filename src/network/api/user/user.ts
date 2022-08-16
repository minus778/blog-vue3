import http from '@/network/http'
import { loginType } from './UserModel'
import { BlogMes } from '@/store/type/storeType'
//使用枚举列出所有请求的url
enum Api {
    login = '/login',
    about = '/about/getAbout',
    deleteImg = '/deleteUploadImg',
    changeWebsite = '/changeWebsiteMes',
    editAbout = '/about/editAbout'
}

//登录
export const login = async (data: loginType) => {
    return await http.post(Api.login, data)
}
//获取关于页内容
export const getAbout = async () => {
    return await http.get(Api.about)
}
//修改关于页内容
export const editAboutContent = async (content: string) => {
    return await http.post(Api.editAbout, { content })
}
//删除图片
export const deleteImg = async (name: string) => {
    return await http.get(Api.deleteImg, { name })
}
//修改网站信息
export const changeWebsite = async (data: BlogMes) => {
    return await http.post(Api.changeWebsite, data)
}