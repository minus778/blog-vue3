//tags标签仓库
import { IComment, CommentRead } from '../type/storeType'
import { getAllComment, deleteCommentById, submitComment } from '@/network/api/comment/comment'
import { ActionContext } from "vuex";
import { RootState } from "../index";
import { Result } from "@/network/request";
import useDate from '@/hooks/useDate'
//定义约束state
export type CommentsState = {
    commentList: Array<IComment>,
    articleCommentNum: [],
    articleCommentReadList: Array<number>,
    mesCommentReadList: Array<number>,
    deleteCommentId: Array<number>,
    delArticleList: Array<number>
}

export const state: CommentsState = {
    commentList: [],
    articleCommentNum: [],
    //获取localStorage存储的文章评论已读
    articleCommentReadList: JSON.parse(localStorage.getItem('blogArticleCommentReadList') as string) || [],
    //获取localStorage存储的留言已读
    mesCommentReadList: JSON.parse(localStorage.getItem('blogMesCommentReadList') as string) || [],
    //记录被删除的一级评论id
    deleteCommentId: JSON.parse(localStorage.getItem('blogDeleteCommentList') as string) || [],
    //记录被删除的文章id数组
    delArticleList: JSON.parse(localStorage.getItem('blogDelArticleList') as string) || []
}

export const mutations = {
    setCommentList(state: CommentsState, commentList: Array<IComment>) {
        //按时间从大到小排序
        const { timeSort } = useDate()
        commentList = timeSort(commentList, 'date', 'big')
        let list: any = []
        //记录文章对应的评论数(以文章id为索引)
        commentList.forEach(item => {
            if (list[item.articleId as number]) {
                list[item.articleId as number]++
            } else {
                list[item.articleId as number] = 1
            }
            //记录评论已读未读
            //文章评论
            if (item.articleId) {
                item.read = state.articleCommentReadList?.indexOf(item.id as number) != -1
                //记录评论对应文章是否已被删除
                if (state.delArticleList.length != 0) {
                    item.isdelArticle = state.delArticleList.indexOf(item.articleId) != -1
                }
            } else {
                //留言
                item.read = state.mesCommentReadList?.indexOf(item.id as number) != -1
            }
            //标记一级评论被删除的二级评论
            if (state.deleteCommentId.length != 0 && item.parentId) {
                item.parentDelete = state.deleteCommentId.indexOf(item.parentId) != -1
            }

        })
        state.articleCommentNum = list
        console.log('文章对应评论数：', state.articleCommentNum);
        state.commentList = commentList
    },
    //设置某条评论已读
    setOneCommentRead(state: CommentsState, options: CommentRead) {
        //该id评论设为已读
        for (let i = 0; i < state.commentList.length; i++) {
            if (state.commentList[i].id === options.id) {
                state.commentList[i].read = true
                break
            }
        }
        //文章评论已读
        if (options.type === 'article') {
            state.articleCommentReadList.push(options.id)
            localStorage.setItem('blogArticleCommentReadList', JSON.stringify(state.articleCommentReadList))
        }
        //留言已读
        if (options.type === 'message') {
            state.mesCommentReadList.push(options.id)
            localStorage.setItem('blogMesCommentReadList', JSON.stringify(state.mesCommentReadList))
        }
    },
    //设置所有评论已读
    setAllCommentRead(state: CommentsState, options: any) {
        //需要设置为已读的未读评论列表
        let readList = options.list
        //文章评论已读
        if (options.type === 'article') {
            //双层循环
            readList.forEach((item: any) => {
                for (let i = 0; i < state.commentList.length; i++) {
                    if (state.commentList[i].id === item.id) {
                        state.commentList[i].read = true
                        break
                    }
                }
                state.articleCommentReadList.push(item.id as number)
            })

            //持久存储-刷新数据不丢失
            localStorage.setItem('blogArticleCommentReadList', JSON.stringify(state.articleCommentReadList))
        }
        //留言已读
        if (options.type === 'message') {
            //双层循环
            readList.forEach((item: any) => {
                for (let i = 0; i < state.commentList.length; i++) {
                    if (state.commentList[i].id === item.id) {
                        state.commentList[i].read = true
                        break
                    }
                }
                state.mesCommentReadList.push(item.id as number)
            })
            //持久存储-刷新数据不丢失
            localStorage.setItem('blogMesCommentReadList', JSON.stringify(state.mesCommentReadList))
        }
    },
    //删除评论
    deleteComment(state: CommentsState, id: number) {
        //评论id对应的文章评论数减一
        let articleComment = state.commentList.find(item => {
            return item.id === id
        })
        //是文章评论对应文章的评论数减一
        if (articleComment?.articleId) {
            state.articleCommentNum[articleComment?.articleId]--
            //如果删除的评论为已读，则删除已读数组中对应的id
            if (articleComment.read) {
                let index = state.articleCommentReadList.indexOf(id)
                state.articleCommentReadList.splice(index, 1)
                localStorage.setItem('blogArticleCommentReadList', JSON.stringify(state.articleCommentReadList))
            }
        } else {
            //如果删除的留言为已读，则删除已读数组中对应的id
            if (articleComment?.read) {
                let index = state.mesCommentReadList.indexOf(id)
                state.mesCommentReadList.splice(index, 1)
                localStorage.setItem('blogMesCommentReadList', JSON.stringify(state.mesCommentReadList))
            }
        }
        //更新评论列表
        state.commentList = state.commentList.filter(item => {
            return item.id != id
        })
        //存储删除的一级评论id
        //先判断删除的评论是否是一级评论
        if (!articleComment?.parentId) {
            state.deleteCommentId.push(id)
            localStorage.setItem('blogDeleteCommentList', JSON.stringify(state.deleteCommentId))
            //更新二级评论对应的一级评论是否还存在
            state.commentList.forEach(item => {
                if (item.parentId === id) {
                    item.parentDelete = true
                }
            })
        }
    },
    //添加评论
    addComment(state: CommentsState, data: IComment) {
        if (data.articleId) {
            //评论对应文章id加一
            state.articleCommentNum[data.articleId]++
            //记录评论对应文章是否已被删除
            if (state.delArticleList.length != 0) {
                data.isdelArticle = state.delArticleList.indexOf(data.articleId) != -1
            }
        }
        //记录评论为未读
        data.read = false
        //记录是否是一级评论被删除的二级评论
        if (state.deleteCommentId.length != 0 && data.parentId) {
            data.parentDelete = state.deleteCommentId.indexOf(data.parentId) != -1
        }

        //将处理完的这一条评论数据添加到评论列表中(添加到数组最前面，时间是最新的，不需要进行排序)
        state.commentList.unshift(data)

    },
    //更新评论列表中评论对应的文章是否被删除(删除文章时调用，主要是解决删除文章该仓库评论列表未触发刷新从而评论页的评论未改变的问题)
    isDelArticle(state: CommentsState, articleId: number) {
        state.commentList.forEach(item => {
            if (item.articleId === articleId) {
                item.isdelArticle = true
            }
        })
    }
}

export const getters = {
    //评论列表
    commentList(state: CommentsState) {
        return JSON.parse(JSON.stringify(state.commentList))
    },
    //文章对应评论数
    articleCommentNum(state: CommentsState) {
        return JSON.parse(JSON.stringify(state.articleCommentNum))
    },
    //文章评论
    articleComment(state: CommentsState) {
        let list = state.commentList.filter(item => {
            return item.articleId
        })
        return list
    },
    //留言
    leaveMessage(state: CommentsState) {
        let list = state.commentList.filter(item => {
            return !item.articleId
        })
        return list
    },
    //文章评论未读消息数量
    articleReadNum(state: CommentsState) {
        let list = state.commentList.filter(item => {
            return item.articleId && !item.read
        })
        return list.length
    },
    //留言未读消息数量
    mesReadNum(state: CommentsState) {
        let list = state.commentList.filter(item => {
            return !item.articleId && !item.read
        })
        return list.length
    }
}

export const actions = {
    //获取评论列表数据
    getCommentList({ commit }: ActionContext<CommentsState, RootState>) {
        return new Promise<Result>((resolve, reject) => {
            getAllComment().then(res => {
                if (res.code === 200) {
                    console.log('获取到最新评论列表数据：', res.data);
                    //保存至仓库
                    commit('setCommentList', res.data)
                    resolve(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    },
    //删除评论
    deleteCommentItem({ commit }: ActionContext<CommentsState, RootState>, id: number) {
        return new Promise<Result>((resolve, reject) => {
            deleteCommentById(id).then(res => {
                if (res.code === 200) {
                    console.log('成功删除评论');
                    //更新仓库
                    commit('deleteComment', id)
                    resolve(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    },
    //添加评论
    addCommentItem({ commit }: ActionContext<CommentsState, RootState>, data: IComment) {
        return new Promise<Result>((resolve, reject) => {
            submitComment(data).then(res => {
                if (res.code === 200) {
                    console.log('成功添加评论');
                    console.log(res.data);

                    //更新仓库
                    commit('addComment', res.data)
                    resolve(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}