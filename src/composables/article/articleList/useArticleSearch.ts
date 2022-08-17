//文章模块头部搜索部分逻辑代码
import { ref } from 'vue'
export default function useArticleSearch(serachArticleList: any, articleList: any, currentPage: any, showTableForm: Function) {
    let dropList = ref(['按文章id查询', '按文章名查询', '按时间查询', '按分类名称查询', '按标签名称查询'])
    let chooseMethod = ref(dropList.value[0])
    //查询的文章id
    let articleId = ref(null)
    //查询的文章名
    let articleName = ref('')
    //选择的时间范围
    let date = ref('')
    //查询的分类名称
    let categoryName = ref('')
    //查询的标签名称
    let tagName = ref('')

    //搜索
    const search = () => {
        //按文章id查询
        if (chooseMethod.value === '按文章id查询') {
            if (!articleId.value) {
                ElMessage({
                    message: '请输入文章id',
                    type: 'warning'
                })
            } else {
                console.log('查询文章id：', articleId.value);
                serachArticleList.value = articleList.value.filter((item: any) => {
                    return item.id === Number(articleId.value)
                })
                //将分页重置
                currentPage.value = 1
                //按照当前分页显示整理表格对应显示内容
                showTableForm(JSON.parse(JSON.stringify(serachArticleList.value)))
                //清空输入框
                articleId.value = null
            }
        }
        //按文章名查询
        if (chooseMethod.value === '按文章名查询') {
            if (!articleName.value) {
                ElMessage({
                    message: '请输入文章名',
                    type: 'warning'
                })
            } else {
                console.log('查询文章名：', articleName.value);
                serachArticleList.value = articleList.value.filter((item: any) => {
                    return item.title.includes(articleName.value)
                })
                //将分页重置
                currentPage.value = 1
                //按照当前分页显示整理表格对应显示内容
                showTableForm(JSON.parse(JSON.stringify(serachArticleList.value)))
                //清空输入框
                articleName.value = ''
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
                serachArticleList.value = articleList.value.filter((item: any) => {
                    return item.date >= start && item.date <= end
                })
                //将分页重置
                currentPage.value = 1
                //按照当前分页显示整理表格对应显示内容
                showTableForm(JSON.parse(JSON.stringify(serachArticleList.value)))
                //清空时间框
                date.value = ''
            }
        }
        //按分类名称查询
        if (chooseMethod.value === '按分类名称查询') {
            if (!categoryName.value) {
                ElMessage({
                    message: '请输入分类名称',
                    type: 'warning'
                })
            } else {
                console.log('查询分类名称：', categoryName.value);
                serachArticleList.value = articleList.value.filter((item: any) => {
                    return item.categoryId.name === categoryName.value
                })
                //将分页重置
                currentPage.value = 1
                //按照当前分页显示整理表格对应显示内容
                showTableForm(JSON.parse(JSON.stringify(serachArticleList.value)))
                //清空输入框
                categoryName.value = ''
            }
        }
        //按标签名称查询
        if (chooseMethod.value === '按标签名称查询') {
            if (!tagName.value) {
                ElMessage({
                    message: '请输入标签名称',
                    type: 'warning'
                })
            } else {
                console.log('查询标签名称：', tagName.value);
                serachArticleList.value = articleList.value.filter((item: any) => {
                    return item.tagId.some((tag: any) => {
                        return tag.name === tagName.value
                    })
                })
                //将分页重置
                currentPage.value = 1
                //按照当前分页显示整理表格对应显示内容
                showTableForm(JSON.parse(JSON.stringify(serachArticleList.value)))
                //清空输入框
                tagName.value = ''
            }
        }
    }
    //重置
    const resetBtn = () => {
        currentPage.value = 1
        showTableForm(JSON.parse(JSON.stringify(articleList.value)))
    }
    return {
        chooseMethod,
        dropList,
        articleId,
        articleName,
        date,
        categoryName,
        tagName,
        search,
        resetBtn
    }
}