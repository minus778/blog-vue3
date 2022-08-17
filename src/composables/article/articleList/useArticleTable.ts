//文章模块表格部分
import { useStore } from '@/store';
import { useRouter } from 'vue-router'
import useDate from '@/hooks/useDate'

export default function useArticleTable(editArticleId: any, articleList: any, artileSortList: any, serachArticleList: any, showTableForm: Function) {
    const store = useStore()
    const router = useRouter()
    const { timeSort } = useDate()

    //表格排序
    const tableSort = (temp: any) => {
        //查询的文章列表
        let oldList = JSON.parse(JSON.stringify(serachArticleList.value))
        //非查询状态下的文章列表
        let list = JSON.parse(JSON.stringify(articleList.value))
        //判断当前使用查询文章列表还是非查询
        let nowList = list.length === artileSortList.value.length ? list : oldList
        const { prop, order } = temp
        //prop为当前排序的属性，order为排序条件（ascending为升序，descending 为降序，null为原始顺序）
        if (prop && order) {
            let sort = order === 'ascending' ? 'small' : 'big'
            artileSortList.value = timeSort(nowList, prop, sort)
        } else {
            artileSortList.value = nowList
        }
        showTableForm()
    }

    //编辑文章
    const changeArticles = (id: number) => {
        console.log('编辑的文章id：', id);
        editArticleId.value = id
        router.push({
            path: '/addArticle',
            query: { editArticleId: id }
        })
    }

    //删除文章
    const deleteArticles = (itemd: any) => {
        console.log('删除的文章id：', itemd.id);
        //确认弹框
        ElMessageBox.confirm(
            `真的要把《${itemd.title}》删掉了吗？要不要再考虑下？`,
            '提示',
            {
                confirmButtonText: '删了吧！',
                cancelButtonText: '我再考虑下',
                type: 'warning',
            }
        )
            .then(() => {
                let temp = JSON.parse(JSON.stringify(itemd))
                let categoryId = temp.categoryId.id
                let tagId = temp.tagId.map((items: any) => {
                    return parseInt(items.id)
                })
                let data = {
                    id: itemd.id,
                    categoryId,
                    tagId,
                    //文章对应图片列表(注意类型:字符串->数组)
                    imgList: JSON.parse(itemd.imgList)
                }
                store.dispatch('articles/deleteArticlebyId', data).then(res => {
                    if (res.code === 200) {
                        ElMessage({
                            type: 'success',
                            message: res.msg,
                        })
                        //文章删除成功将对应的分类文章数减一
                        store.commit('categories/minusArticleNum', categoryId)
                        //文章删除成功将对应的标签文章数减一
                        store.commit('tags/minusArticleNum', tagId)
                        //调用评论列表仓库，刷新仓库中对应文章id的评论
                        store.commit('comments/isDelArticle', itemd.id)
                        //在当前显示到表格中的数据中删除已经删除掉的文章
                        artileSortList.value = artileSortList.value.filter((item: any) => {
                            return item.id != itemd.id
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
    return {
        tableSort,
        changeArticles,
        deleteArticles
    }
}