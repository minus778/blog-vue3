import http from '@/network/http'
import { addArticle } from './ArticleModel'
//使用枚举列出所有请求的url
enum Api {
    getAllArticle = '/articles/getArticleAllContent',
    deleteArticle = '/articles/deleteArticle',
    uploadImg = '/uploadImg',
    deleteImg = '/deleteUploadImg',
    addArticle = '/articles/addArticle',
    deleteImgList = 'articles/deleteImgList',
    editArticle = 'articles/editArticle'
}

//获取所有文章列表
export const getArticle = async () => {
    return await http.get(Api.getAllArticle)
}

//根据id删除文章
export const deleteArticleById = async (data: any) => {
    return await http.post(Api.deleteArticle, data)
}

//上传图片
export const uploadImg = async (data: any) => {
    return await http.uploadImg(Api.uploadImg, data)
}

//删除图片
export const deleteImg = async (name: string) => {
    return await http.get(Api.deleteImg, { name })
}

//新增文章
export const AddArticle = async (data: addArticle) => {
    return await http.post(Api.addArticle, data)
}

//删除图片列表
export const deleteImgList = async (list: string[]) => {
    return await http.post(Api.deleteImgList, list)
}

//编辑文章
export const EditArticle = async (data: addArticle) => {
    return await http.post(Api.editArticle, data)
}