import http from '@/network/http'
import { ICategory } from '@/store/type/storeType'
//使用枚举列出所有请求的url
enum Api {
    getAllCategory = '/categories/getCategories',
    addCategory = '/categories/addCategories',
    editCategory = '/categories/editCategories',
    deleteCategory = '/categories/deleteCategories'
}

//获取所有分类列表
export const getCategory = async () => {
    return await http.get(Api.getAllCategory)
}
//新增
export const addCategory = async (data: ICategory) => {
    return await http.post(Api.addCategory, data)
}
//编辑
export const editCategory = async (data: ICategory) => {
    return await http.post(Api.editCategory, data)
}
//删除
export const deleteCategory = async (id: number) => {
    return await http.get(Api.deleteCategory, { categoryId: id })
}