//文章模块共用逻辑及基础数据
import { ref, onMounted, nextTick, computed, onActivated, watch } from 'vue'
import { useStore } from '@/store';
import useDate from '@/hooks/useDate'
export default function useArticle(props: any) {
    const store = useStore()
    const { typeTime } = useDate()

    //分页数据
    const currentPage = ref(1)
    const pageSize = ref(10)
    //图片baseurl
    const baseUrl = ref<string>(import.meta.env.VITE_BASEURL)
    //获取图片url
    const avatar = computed(() => {
        return store.getters['user/getAvatar']
    })
    //获取删除的文章id组成的数组
    const delArticleList = computed(() => {
        return store.getters['articles/getDelArticleList']
    })

    //表格的高度
    let tableHeigth = ref(0);
    //表格数据
    let tableData = ref([])
    //当前表格需要用到的评论数据（排序后的评论数据）
    let commentSortList = ref([])
    //查询的评论列表（保存为第一次获取到的查询评论，不改变作为中间数据用于排序原始数据）
    let serachCommentList = ref([])


    //整理当前显示的表格数据(分页)
    const showTableForm = (list?: any) => {
        if (list) {
            commentSortList.value = list
        }
        let length = commentSortList.value.length
        let start = (currentPage.value - 1) * pageSize.value
        let end = currentPage.value * pageSize.value
        if (start < length && end > length) {
            end = length
        }
        //获取最终显示的结果并将日期格式处理一下
        let res = commentSortList.value.slice(start, end)
        res.forEach((item: any) => {
            item.date = typeTime(item.date)
        })
        tableData.value = res
    }

    //首次加载
    onMounted(() => {
        //获取表格高度
        nextTick(() => {
            tableHeigth.value = window.innerHeight - 220
        })
        //整理表格数据
        showTableForm(JSON.parse(JSON.stringify(props.commentList)))
        //监视属性监听到文章被删除就刷新
        watch(delArticleList, (res) => {
            console.log('分类-文章被删除改变', res[res.length - 1]);
            let temp = commentSortList.value as any
            //只更新文章评论，留言不需要处理
            if (temp[0] && temp[0].articleId) {
                //更新文章评论的文章是否被删除(和文章组件的使用同理)
                commentSortList.value.forEach((item: any) => {
                    item.isdelArticle = delArticleList.value.indexOf(item.articleId) != -1
                })
            }
        })
    })
    //keep-alive缓存后进入组件
    onActivated(() => {

    })

    //修改分页容量
    const handleSizeChange = (val: number) => {
        pageSize.value = val
        showTableForm()
    }
    //修改分页当前页
    const handleCurrentChange = (val: number) => {
        currentPage.value = val
        showTableForm()
    }

    //一键已读
    const allRead = (type: string) => {
        let list = JSON.parse(JSON.stringify(commentSortList.value))
        //只传入未读的部分，减少仓库中的循环次数
        list = list.filter((item: any) => {
            return !item.read
        })
        //当存在未读评论时才执行下面的代码
        if (list.length != 0) {
            //将当前展示在表格中的部分评论列表传入仓库将对应这些评论的id设为已读
            store.commit('comments/setAllCommentRead', { type, list })
            //将当前表格展示的部分评论列表变为已读
            commentSortList.value.forEach((item: any) => {
                item.read = true
            })
            //整理表格数据
            showTableForm()
        }
    }

    return {
        tableData,
        tableHeigth,
        currentPage,
        pageSize,
        commentSortList,
        serachCommentList,
        baseUrl,
        avatar,
        handleSizeChange,
        handleCurrentChange,
        showTableForm,
        allRead
    }
}