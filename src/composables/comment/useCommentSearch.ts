//文章模块头部搜索部分逻辑代码
import { ref, computed } from 'vue'
export default function useArticleSearch(serachCommentList: any, props: any, currentPage: any, showTableForm: Function) {
    let articledropList = ref(['按评论id查询', '按昵称查询', '按时间查询', '查询所有已读消息', '查询所有未读消息', '按评论类型查询', '按所属文章id查询'])
    let mesdropList = ref(['按评论id查询', '按昵称查询', '按时间查询', '查询所有已读消息', '查询所有未读消息', '按评论类型查询'])
    let chooseMethod = ref(articledropList.value[0])
    //查询的评论id
    let commentId = ref(null)
    //查询的昵称
    let commentName = ref('')
    //选择的时间范围
    let date = ref('')
    //评论类型
    let commentType = ref('一级评论')
    //所属文章id
    let articleId = ref(null)

    //下拉菜单
    let dropList = computed(() => {
        return props.commentName === '文章评论' ? articledropList.value : mesdropList.value
    })

    //搜索
    const search = () => {
        //按评论id查询
        if (chooseMethod.value === '按评论id查询') {
            if (!commentId.value) {
                ElMessage({
                    message: '请输入评论id',
                    type: 'warning'
                })
            } else {
                console.log('查询评论id：', commentId.value);
                serachCommentList.value = props.commentList.filter((item: any) => {
                    return item.id === Number(commentId.value)
                })
                //将分页重置
                currentPage.value = 1
                //按照当前分页显示整理表格对应显示内容
                showTableForm(JSON.parse(JSON.stringify(serachCommentList.value)))
                //清空输入框
                commentId.value = null
            }
        }
        //按昵称查询
        if (chooseMethod.value === '按昵称查询') {
            if (!commentName.value) {
                ElMessage({
                    message: '请输入评论人昵称',
                    type: 'warning'
                })
            } else {
                console.log('查询昵称：', commentName.value);
                serachCommentList.value = props.commentList.filter((item: any) => {
                    return item.froms.includes(commentName.value)
                })
                //将分页重置
                currentPage.value = 1
                //按照当前分页显示整理表格对应显示内容
                showTableForm(JSON.parse(JSON.stringify(serachCommentList.value)))
                //清空输入框
                commentName.value = ''
            }
        }
        //按时间查询
        if (chooseMethod.value === '按时间查询') {
            if (!date.value) {
                ElMessage({
                    message: '请选择时间',
                    type: 'warning'
                })
            } else {
                console.log('查询时间：', date.value);
                let start = +new Date(date.value[0])
                let end = +new Date(date.value[1])
                console.log('转换为毫秒：', start, end);
                serachCommentList.value = props.commentList.filter((item: any) => {
                    return item.date >= start && item.date <= end
                })
                //将分页重置
                currentPage.value = 1
                //按照当前分页显示整理表格对应显示内容
                showTableForm(JSON.parse(JSON.stringify(serachCommentList.value)))
                //清空时间框
                date.value = ''
            }
        }
        //查询所有已读消息
        if (chooseMethod.value === '查询所有已读消息') {
            serachCommentList.value = props.commentList.filter((item: any) => {
                return item.read
            })
            //将分页重置
            currentPage.value = 1
            //按照当前分页显示整理表格对应显示内容
            showTableForm(JSON.parse(JSON.stringify(serachCommentList.value)))
        }
        //查询所有未读消息
        if (chooseMethod.value === '查询所有未读消息') {
            serachCommentList.value = props.commentList.filter((item: any) => {
                return !item.read
            })
            //将分页重置
            currentPage.value = 1
            //按照当前分页显示整理表格对应显示内容
            showTableForm(JSON.parse(JSON.stringify(serachCommentList.value)))
        }
        //按评论类型查询
        if (chooseMethod.value === '按评论类型查询') {
            if (commentType.value === '一级评论') {
                serachCommentList.value = props.commentList.filter((item: any) => {
                    return !item.tos
                })
            }
            if (commentType.value === '二级评论') {
                serachCommentList.value = props.commentList.filter((item: any) => {
                    return item.tos
                })
            }
            //将分页重置
            currentPage.value = 1
            //按照当前分页显示整理表格对应显示内容
            showTableForm(JSON.parse(JSON.stringify(serachCommentList.value)))
        }
        //按所属文章id查询
        if (chooseMethod.value === '按所属文章id查询' && props.commentName === '文章评论') {
            if (!articleId.value) {
                ElMessage({
                    message: '请输入文章id',
                    type: 'warning'
                })
            } else {
                console.log('查询文章id：', articleId.value);
                serachCommentList.value = props.commentList.filter((item: any) => {
                    return item.articleId === Number(articleId.value)
                })
                //将分页重置
                currentPage.value = 1
                //按照当前分页显示整理表格对应显示内容
                showTableForm(JSON.parse(JSON.stringify(serachCommentList.value)))
                //清空输入框
                articleId.value = null
            }
        }
    }
    //重置
    const resetBtn = () => {
        currentPage.value = 1
        showTableForm(JSON.parse(JSON.stringify(props.commentList)))
    }
    return {
        chooseMethod,
        dropList,
        commentId,
        commentName,
        date,
        commentType,
        articleId,
        search,
        resetBtn
    }
}