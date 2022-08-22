//categories分类仓库
import { ICategory } from '../type/storeType'
import { addCategory, getCategory, editCategory, deleteCategory } from '@/network/api/category/category'
import { ActionContext } from "vuex";
import { RootState } from "../index";
import { Result } from "@/network/request";
import useDate from '@/hooks/useDate'
const { timeSort } = useDate()
//定义约束state
export type CategoriesState = {
    CategoriesList: Array<ICategory>,
    dateName: number,
    isOverReq: boolean
}

export const state: CategoriesState = {
    CategoriesList: [],
    //最新删除时间
    dateName: Number(localStorage.getItem('cateforyDeleteTime')) || 0,
    //记录请求获取数据是否结束
    isOverReq: false
}

export const mutations = {
    setCategoriesList(state: CategoriesState, CategoriesList: Array<ICategory>) {
        //按时间从大到小排序
        CategoriesList = timeSort(CategoriesList, 'date', 'big')
        state.CategoriesList = CategoriesList
        //记录请求结束
        state.isOverReq = true
    },
    addCategoryListItem(state: CategoriesState, data: ICategory) {
        state.CategoriesList.push(data)
        state.CategoriesList = timeSort(state.CategoriesList, 'date', 'big')
    },
    editCategoryListItem(state: CategoriesState, data: ICategory) {
        let list = state.CategoriesList
        for (let i = 0; i < list.length; i++) {
            let item = list[i]
            if (item.id === data.id) {
                item.color = data.color
                item.name = data.name
                item.date = data.date
                break
            }
        }
        state.CategoriesList = timeSort(list, 'date', 'big')
    },
    deleteCategoryListItem(state: CategoriesState, id: number) {
        let list = state.CategoriesList.filter(item => {
            return item.id != id
        })
        state.CategoriesList = timeSort(list, 'date', 'big')
        //记录删除时间
        state.dateName = +new Date()
        //持久存储避免刷新丢失
        localStorage.setItem('cateforyDeleteTime', String(state.dateName))
    },
    //文章数加一
    addArticleNum(state: CategoriesState, id: number) {
        for (let i = 0; i < state.CategoriesList.length; i++) {
            if (state.CategoriesList[i].id === id) {
                (state.CategoriesList[i].num as number)++
                break
            }
        }
    },
    //文章数减一
    minusArticleNum(state: CategoriesState, id: number) {
        for (let i = 0; i < state.CategoriesList.length; i++) {
            if (state.CategoriesList[i].id === id) {
                (state.CategoriesList[i].num as number)--
                break
            }
        }
    }
}

export const getters = {
    //获取分类列表
    CategoriesList(state: CategoriesState) {
        return JSON.parse(JSON.stringify(state.CategoriesList))
    },
    //按文章数量从大到小排序
    categoryArticleSort(state: CategoriesState) {
        let list = []
        if (state.CategoriesList.length != 0) {
            //切换深拷贝避免被外界修改
            list = timeSort(JSON.parse(JSON.stringify(state.CategoriesList)), 'num', 'big')
        }
        return list
    }
}

export const actions = {
    //获取分类列表数据
    getCategoriesList({ commit }: ActionContext<CategoriesState, RootState>) {
        return new Promise<Result>((resolve, reject) => {
            getCategory().then(res => {
                if (res.code === 200) {
                    console.log('获取到最新分类列表数据：', res.data);
                    //保存至仓库
                    commit('setCategoriesList', res.data)
                    resolve(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    },
    //新增分类
    addCategoryItem({ commit }: ActionContext<CategoriesState, RootState>, data: ICategory) {
        return new Promise<Result>((resolve, reject) => {
            addCategory(data).then(res => {
                if (res.code === 200) {
                    console.log('添加成功');
                    //保存至仓库
                    commit('addCategoryListItem', res.data)
                    resolve(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    },
    //修改分类
    editCategoryItem({ commit }: ActionContext<CategoriesState, RootState>, data: ICategory) {
        return new Promise<Result>((resolve, reject) => {
            editCategory(data).then(res => {
                if (res.code === 200) {
                    console.log('修改成功');
                    //保存至仓库
                    commit('editCategoryListItem', data)
                    resolve(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    },
    //删除分类
    deleteCategoryItem({ commit }: ActionContext<CategoriesState, RootState>, id: number) {
        return new Promise<Result>((resolve, reject) => {
            deleteCategory(id).then(res => {
                if (res.code === 200) {
                    console.log('删除成功');
                    //保存至仓库
                    commit('deleteCategoryListItem', id)
                    resolve(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}