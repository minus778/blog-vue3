//文章模块表格部分
import { useStore } from '@/store';
import useDate from '@/hooks/useDate'
import { ref, computed } from 'vue'
import { IComment } from '@/store/type/storeType'

export default function useArticleTable(props: any, commentSortList: any, serachCommentList: any, showTableForm: Function) {
    const store = useStore()
    const { timeSort } = useDate()
    //是否显示弹出框
    let dialogFormVisible = ref(false)
    //回复对象信息
    let replyMes: any = ref({})
    //回复内容
    let replayContent = ref('')

    //获取用户名称
    const name = computed(() => {
        return store.getters['user/getName']
    })

    //表格排序
    const tableSort = (temp: any) => {
        //查询的评论列表
        let oldList = JSON.parse(JSON.stringify(serachCommentList.value))
        //非查询状态下的评论列表
        let list = JSON.parse(JSON.stringify(props.commentList))
        //判断当前使用查询评论列表还是非查询
        let nowList = list.length === commentSortList.value.length ? list : oldList
        const { prop, order } = temp
        //prop为当前排序的属性，order为排序条件（ascending为升序，descending 为降序，null为原始顺序）
        if (prop && order) {
            let sort = order === 'ascending' ? 'small' : 'big'
            commentSortList.value = timeSort(nowList, prop, sort)
        } else {
            commentSortList.value = nowList
        }
        showTableForm()
    }

    //回复评论
    const changeArticles = (item: IComment) => {
        console.log('回复的评论id：', item.id);
        replyMes.value = item
        dialogFormVisible.value = true
    }

    //提交评论
    const submitComment = () => {
        //提交评论的数据
        let data: IComment = {
            tos: replyMes.value.froms,
            froms: name.value,
            email: '',
            content: replayContent.value,
            date: +new Date(),
            articleId: replyMes.value.articleId,
            //区分一级评论还是二级评论
            parentId: replyMes.value.parentId ? replyMes.value.parentId : replyMes.value.id,
            toId: replyMes.value.id
        }
        store.dispatch('comments/addCommentItem', data).then(res => {
            if (res.code === 200) {
                ElMessage({
                    type: 'success',
                    message: res.msg,
                })
                //提交评论成功
                //清空输入框并关闭弹出框
                replayContent.value = ''
                dialogFormVisible.value = false
                //处理评论并添加到当前显示的评论数组中
                //这里需要注意要深拷贝res.data，因为是复杂数据，不然会直接改变res.data的数据从而影响其他使用这个数据的地方
                let data = JSON.parse(JSON.stringify(res.data))
                //评论未读
                data.read = false
                //评论是否一级评论被删除
                if (replyMes.value.parentDelete) {
                    data.parentDelete = replyMes.value.parentDelete
                }
                //评论对应文章是否被删除
                if (replyMes.value.isdelArticle) {
                    data.isdelArticle = replyMes.value.isdelArticle
                }
                commentSortList.value.unshift(data)
                //重新刷新表格
                showTableForm()
            }
        }).catch(err => {
            console.log(err)
            ElMessage.error('请求出错')
        })
    }

    //删除评论
    const deleteArticles = (item: IComment) => {
        console.log('删除的评论id：', item.id);
        //确认弹框
        ElMessageBox.confirm(
            `真的要把评论人(${item.froms})的评论(${item.content})删掉了吗？要不要再考虑下？`,
            '提示',
            {
                confirmButtonText: '删了吧！',
                cancelButtonText: '我再考虑下',
                type: 'warning',
            }
        )
            .then(() => {
                store.dispatch('comments/deleteCommentItem', item.id).then(res => {
                    if (res.code === 200) {
                        ElMessage({
                            type: 'success',
                            message: res.msg,
                        })
                        //在当前显示到表格中的数据中删除已经删除掉的评论
                        commentSortList.value = commentSortList.value.filter((items: any) => {
                            return items.id != item.id
                        })
                        //更新二级评论对应的一级评论是否被删除
                        commentSortList.value.forEach((items: any) => {
                            if (items.parentId === item.id) {
                                items.parentDelete = true
                            }
                        })
                        //重新刷新表格
                        showTableForm()
                    }
                }).catch(err => {
                    console.log(err)
                    ElMessage.error('请求出错')
                })
            })
    }

    //设置单条评论已读
    const readnow = (id: number, type: string) => {
        store.commit('comments/setOneCommentRead', { id, type })
        //将表格中当前id的评论设为已读
        for (let i = 0; i < commentSortList.value.length; i++) {
            if (commentSortList.value[i].id === id) {
                commentSortList.value[i].read = true
                break
            }
        }
        //整理表格数据
        showTableForm()
    }

    return {
        dialogFormVisible,
        replyMes,
        replayContent,
        tableSort,
        changeArticles,
        deleteArticles,
        readnow,
        submitComment
    }
}