//tags标签仓库
import { ITag } from '../type/storeType'
import { getTag, addTag, editTag, deleteTag } from '@/network/api/tag/tag'
import { ActionContext } from "vuex";
import { RootState } from "../index";
import { Result } from "@/network/request";
import useDate from '@/hooks/useDate'
const { timeSort } = useDate()
//定义约束state
export type TagsState = {
    tagList: Array<ITag>,
    dateName: number,
    isOverReq: boolean
}

export const state: TagsState = {
    tagList: [],
    //最新删除时间
    dateName: Number(localStorage.getItem('tagDeleteTime')) || 0,
    //记录请求获取数据是否结束
    isOverReq: false
}

export const mutations = {
    setTagList(state: TagsState, tagList: Array<ITag>) {
        //按时间从大到小排序
        tagList = timeSort(tagList, 'date', 'big')
        state.tagList = tagList
        //记录请求结束
        state.isOverReq = true
    },
    addTagListItem(state: TagsState, data: ITag) {
        state.tagList.push(data)
        state.tagList = timeSort(state.tagList, 'date', 'big')
    },
    editTagListItem(state: TagsState, data: ITag) {
        let list = state.tagList
        for (let i = 0; i < list.length; i++) {
            let item = list[i]
            if (item.id === data.id) {
                item.color = data.color
                item.name = data.name
                item.date = data.date
                break
            }
        }
        state.tagList = timeSort(list, 'date', 'big')
    },
    deleteTagListItem(state: TagsState, id: number) {
        let list = state.tagList.filter(item => {
            return item.id != id
        })
        state.tagList = timeSort(list, 'date', 'big')
        //记录删除时间
        state.dateName = +new Date()
        //持久存储避免刷新丢失
        localStorage.setItem('tagDeleteTime', String(state.dateName))
    },
    //文章数加一
    addArticleNum(state: TagsState, tagIdList: number[]) {
        state.tagList.forEach(item => {
            if (tagIdList.indexOf(item.id as number) != -1) {
                (item.num as number)++
            }
        })
    },
    //文章数减一
    minusArticleNum(state: TagsState, tagIdList: number[]) {
        state.tagList.forEach(item => {
            if (tagIdList.indexOf(item.id as number) != -1) {
                (item.num as number)--
            }
        })
    }
}

export const getters = {
    //标签列表
    tagList(state: TagsState) {
        return JSON.parse(JSON.stringify(state.tagList))
    },
    //按文章数量从大到小排序
    tagArticleSort(state: TagsState) {
        let list = []
        if (state.tagList.length != 0) {
            //使用深拷贝避免被外界修改
            list = timeSort(JSON.parse(JSON.stringify(state.tagList)), 'num', 'big')
        }
        return list
    }
}

export const actions = {
    //获取标签列表数据
    getTagList({ commit }: ActionContext<TagsState, RootState>) {
        return new Promise<Result>((resolve, reject) => {
            getTag().then(res => {
                if (res.code === 200) {
                    console.log('获取到最新标签列表数据：', res.data);
                    //保存至仓库
                    commit('setTagList', res.data)
                    resolve(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    },
    //新增分类
    addTagItem({ commit }: ActionContext<TagsState, RootState>, data: ITag) {
        return new Promise<Result>((resolve, reject) => {
            addTag(data).then(res => {
                if (res.code === 200) {
                    console.log('添加成功');
                    //保存至仓库
                    commit('addTagListItem', res.data)
                    resolve(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    },
    //修改分类
    editTagItem({ commit }: ActionContext<TagsState, RootState>, data: ITag) {
        return new Promise<Result>((resolve, reject) => {
            editTag(data).then(res => {
                if (res.code === 200) {
                    console.log('修改成功');
                    //保存至仓库
                    commit('editTagListItem', data)
                    resolve(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    },
    //删除分类
    deleteTagItem({ commit }: ActionContext<TagsState, RootState>, id: number) {
        return new Promise<Result>((resolve, reject) => {
            deleteTag(id).then(res => {
                if (res.code === 200) {
                    console.log('删除成功');
                    //保存至仓库
                    commit('deleteTagListItem', id)
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