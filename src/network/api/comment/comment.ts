import http from '@/network/http'
import { IComment } from '@/store/type/storeType'
//使用枚举列出所有请求的url
enum Api {
    getAllComment = '/comment/getAllComment',
    deleteCommentById = '/comment/deleteComment',
    submitComment = '/comment/submitComment'
}

//获取所有评论列表
export const getAllComment = async () => {
    return await http.get(Api.getAllComment)
}
//删除评论
export const deleteCommentById = async (id: number) => {
    return await http.get(Api.deleteCommentById, { commentId: id })
}
//提交评论
export const submitComment = async (data: IComment) => {
    return await http.post(Api.submitComment, data)
}