import http from '@/network/http'
import { ITag } from '@/store/type/storeType'
//使用枚举列出所有请求的url
enum Api {
    getAllTag = '/tags/getTags',
    addTag = '/tags/addTags',
    editTag = '/tags/editTags',
    deleteTag = '/tags/deleteTags'
}

//获取所有标签列表
export const getTag = async () => {
    return await http.get(Api.getAllTag)
}
//新增
export const addTag = async (data: ITag) => {
    return await http.post(Api.addTag, data)
}
//编辑
export const editTag = async (data: ITag) => {
    return await http.post(Api.editTag, data)
}
//删除
export const deleteTag = async (id: number) => {
    return await http.get(Api.deleteTag, { tagId: id })
}