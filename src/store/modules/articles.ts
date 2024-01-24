//article文章仓库
import { IArticle } from '../type/storeType'
import { getArticle, deleteArticleById, AddArticle, EditArticle } from '@/network/api/article/article'
import { ActionContext } from "vuex";
import { RootState } from "../index";
import { Result } from "@/network/request";
import useDate from '@/hooks/useDate'
import { addArticle } from '@/network/api/article/ArticleModel'
//定义约束state
export type ArticlesState = {
  articleList: Array<IArticle>,
  deleteArticleIdList: Array<number>,
  isOverReq: boolean
}

export const state: ArticlesState = {
  articleList: [],
  //记录删除的文章id的数组
  deleteArticleIdList: JSON.parse(localStorage.getItem('blogDelArticleList') as string) || [],
  //记录请求获取数据是否结束
  isOverReq: false
}

export const mutations = {
  setArticleList (state: ArticlesState, articleList: Array<IArticle>) {
    //按时间从大到小排序
    const { timeSort } = useDate()
    articleList = timeSort(articleList, 'date', 'big')
    state.articleList = articleList
    //记录请求结束
    state.isOverReq = true
  },
  //根据id删除仓库文章
  deleteArticle (state: ArticlesState, id: number) {
    //记录删除的文章id
    state.deleteArticleIdList.push(id)
    localStorage.setItem('blogDelArticleList', JSON.stringify(state.deleteArticleIdList))
    state.articleList = state.articleList.filter(item => {
      return item.id != id
    })
  },
  //新增文章
  AddArticleItem (state: ArticlesState, data: IArticle) {
    state.articleList.unshift(data)
  },
  //编辑文章
  EditArticleItem (state: ArticlesState, data: IArticle) {
    let editId = state.articleList.findIndex(item => item.id === data.id)
    state.articleList[editId] = data
  }
}

export const getters = {
  //获取文章列表
  articleList (state: ArticlesState) {
    return JSON.parse(JSON.stringify(state.articleList))
  },
  //返回最新一年年份
  getCurrenyYear (state: ArticlesState) {
    let year = state.articleList.length ? new Date(state.articleList[0].date).getFullYear() : ''
    return year
  },
  //返回最新一年每月对应文章数量
  getMonthArticle (state: ArticlesState) {
    let numList = []
    //获取当前年份
    //没有文章就直接返回12个0组成的数组
    if (state.articleList.length === 0) {
      for (let i = 0; i < 12; i++) {
        numList.push(0)
      }
    } else {
      let year = new Date(state.articleList[0].date).getFullYear()
      //获取最新一年文章组成的数组
      let yearList = state.articleList.filter(item => {
        return new Date(item.date).getFullYear() === year
      })
      //计算每一月对应文章数量
      for (let i = 0; i < 12; i++) {
        numList.push(
          yearList.filter(item => {
            return new Date(item.date).getMonth() === i
          }).length
        )
      }
    }
    return numList
  },
  //返回删除的文章id组成的数组
  getDelArticleList (state: ArticlesState) {
    return JSON.parse(JSON.stringify(state.deleteArticleIdList))
  }
}

export const actions = {
  //获取文章列表数据
  getArticleList ({ commit }: ActionContext<ArticlesState, RootState>) {
    return new Promise<Result>((resolve, reject) => {
      getArticle().then(res => {
        if (res.code === 200) {
          console.log('获取到最新文章数据：', res.data);
          //保存至仓库
          commit('setArticleList', res.data)
          resolve(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  //删除文章
  deleteArticlebyId ({ commit }: ActionContext<ArticlesState, RootState>, data: any) {
    return new Promise<Result>((resolve, reject) => {
      deleteArticleById(data).then(res => {
        //数据库删除成功
        if (res.code === 200) {
          //更新仓库
          commit('deleteArticle', data.id)
          resolve(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  //添加文章
  addArticleItem ({ commit }: ActionContext<ArticlesState, RootState>, data: addArticle) {
    return new Promise<Result>((resolve, reject) => {
      AddArticle(data).then(res => {
        //添加文章成功
        if (res.code === 200) {
          //更新仓库
          commit('AddArticleItem', res.data)
          resolve(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  //编辑文章
  editArticleItem ({ commit }: ActionContext<ArticlesState, RootState>, data: addArticle) {
    return new Promise<Result>((resolve, reject) => {
      EditArticle(data).then(res => {
        //编辑文章成功
        if (res.code === 200) {
          //更新仓库
          commit('EditArticleItem', res.data)
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