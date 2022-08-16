//文章模块共用逻辑及基础数据
import { ref, onMounted, nextTick, computed, onActivated, watch } from 'vue'
import { useStore } from '@/store';
import useDate from '@/hooks/useDate'
export default function useArticle() {
    const store = useStore()
    const { typeTime } = useDate()

    //分页数据
    const currentPage = ref(1)
    const pageSize = ref(10)

    //记录编辑文章的id
    let editArticleId = ref(-1)

    //表格的高度
    let tableHeigth = ref(0);
    //表格数据
    let tableData = ref([])
    //当前表格需要用到的文章数据（排序后的文章数据）
    let artileSortList = ref<any>([])
    //查询的文章列表（保存为第一次获取到的查询文章，不改变作为中间数据用于排序原始数据）
    let serachArticleList = ref([])

    //获取分类数据
    let categoryList = computed(() => {
        return store.getters['categories/CategoriesList']
    })
    //获取标签数据
    let tagList = computed(() => {
        return store.getters['tags/tagList']
    })
    //获取文章对应评论数
    let commentNum = computed(() => {
        return store.getters['comments/articleCommentNum']
    })
    //获取文章数据(仅供监视使用)
    let watchArticleList = computed(() => {
        return store.getters['articles/articleList']
    })
    //获取文章数据（这个数据作为该组件处理的文章数据的保存点需要在表格排序的原始数据用到且是仓库数据，不能被改变，但由于是复杂数据，在其他地方直接赋值是浅拷贝，会修改当前数据，所以在赋值时要将该数据转为深拷贝再使用避免被修改）
    let articleList = computed(() => {
        let list = store.getters['articles/articleList']
        //将文章分类id和标签id及评论切换为能显示的名称及对应颜色
        list.forEach((item: any) => {
            //分类
            item.categoryId = categoryList.value.find((items: any) => {
                return items.id === item.categoryId
            })
            //标签
            let taglist: any = []
            item.tagId.split('、').forEach((tagItem: any) => {
                taglist.push(
                    tagList.value.find((items: any) => {
                        return items.id === Number(tagItem)
                    })
                )
            })
            item.tagId = taglist
            //评论
            item.comment = commentNum.value[item.id] ? commentNum.value[item.id] : 0

        })
        return list
    })

    //整理当前显示的表格数据(分页)
    const showTableForm = (list?: any) => {
        if (list) {
            artileSortList.value = list
        }
        let length = artileSortList.value.length
        let start = (currentPage.value - 1) * pageSize.value
        let end = currentPage.value * pageSize.value
        if (start < length && end > length) {
            end = length
        }
        //获取最终显示的结果并将日期格式处理一下
        let res = artileSortList.value.slice(start, end)
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
        showTableForm(JSON.parse(JSON.stringify(articleList.value)))
        //监视属性监听到分类数据改变就刷新
        watch(categoryList, (res) => {
            console.log('文章-分类改变');
            //分类被修改后修改的哪个分类由于时间排序会在数组的第一项，所以直接把分类数组第一项和当前文章比较，不需要考虑分类删除的问题，因为分类在被删除之前已经没有文章属于这个分类了
            artileSortList.value.forEach((item: any) => {
                if (item.categoryId.id === res[0].id) {
                    item.categoryId = res[0]
                }
            })
        })
        //监视属性监听到标签数据改变就刷新
        watch(tagList, (res) => {
            console.log('文章-标签改变');
            artileSortList.value.forEach((item: any) => {
                for (let i = 0; i < item.tagId.length; i++) {
                    if (item.tagId[i].id === res[0].id) {
                        item.tagId[i] = res[0]
                        break
                    }
                }
            })
        })
        //监听文章评论数是否改变
        watch(commentNum, (res) => {
            console.log('文章-评论数改变');
            //更新文章对应评论数(其他数据都能更新，但是评论数是在评论页修改，不能同步修改这个组件里的数据)
            artileSortList.value.forEach((item: any) => {
                item.comment = commentNum.value[item.id] ? commentNum.value[item.id] : 0
            })
        })
        //监听文章列表是否改变(新增文章)
        watch(watchArticleList, (newValue, oldValue) => {
            //新增
            if (newValue.length > oldValue.length) {
                console.log('文章-新增文章');
                //新增文章后直接刷新当前表格
                showTableForm(articleList.value)

            }
            //编辑
            if (newValue.length === oldValue.length) {
                console.log('文章-编辑文章');
                //找当前表格数据中修改文章的索引
                let index = artileSortList.value.findIndex((item: any) => {
                    return item.id === editArticleId.value
                })
                //找仓库文章列表中修改文章的索引
                let index2 = articleList.value.findIndex((item2: any) => {
                    return item2.id === editArticleId.value
                })
                //当前显示的表格中的文章列表包含修改的文章就替换
                if (index != -1) {
                    artileSortList.value[index] = JSON.parse(JSON.stringify(articleList.value[index2]))
                }
                //刷新当前表格数据
                showTableForm()
            }
            //删除
            if (newValue.length < oldValue.length) {
                console.log('文章-删除文章');
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

    return {
        tableData,
        tableHeigth,
        currentPage,
        pageSize,
        artileSortList,
        articleList,
        serachArticleList,
        editArticleId,
        handleSizeChange,
        handleCurrentChange,
        showTableForm
    }
}