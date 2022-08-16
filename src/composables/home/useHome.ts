// 首页home模块基础逻辑部分
import { computed } from 'vue'
import useDate from '@/hooks/useDate'
import { store } from '@/store/index.js';
export default function useHome() {
    //文章列表
    let articleList = computed(() => {
        return store.getters['articles/articleList']
    })
    //分类列表
    let categoryList = computed(() => {
        return store.getters['categories/CategoriesList']
    })
    //标签列表
    let tagList = computed(() => {
        return store.getters['tags/tagList']
    })
    //评论列表
    let commentList = computed(() => {
        return store.getters['comments/commentList']
    })
    //获取分类最新删除时间
    let categorylatestDate = computed(() => {
        return store.state.categories.dateName
    })
    //获取标签最新删除时间
    let taglatestDate = computed(() => {
        return store.state.tags.dateName
    })

    // onMounted(() => {
    //     //首页一加载就获取评论列表
    //     getComment()
    // })
    // //获取评论数据
    // const getComment = async () => {
    //     await store.dispatch('comments/getCommentList')
    // }

    //返回最新时间
    const getShortDate = (list: any) => {
        const { typeBeforeDate } = useDate()
        //判断传入的是否是数字来判断是否是删除时间
        let time = typeof list === 'number' ? list : list[0].date
        return typeBeforeDate(time)
    }

    return {
        articleList,
        categoryList,
        tagList,
        commentList,
        categorylatestDate,
        taglatestDate,
        getShortDate
    }
}