//新增/编辑文章页基础共用数据及逻辑
import { ref, reactive, computed, onMounted, onActivated, onBeforeUnmount, watch } from 'vue'
import { addArticle } from '@/network/api/article/ArticleModel'
import { deleteImgList } from '@/network/api/article/article'
import type { FormInstance, FormRules } from 'element-plus'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
export default function useAddArticleBase() {
    const store = useStore()
    const route = useRoute()
    //表单dom
    const ruleFormRef = ref<FormInstance>()

    type data = {
        title: string,
        selectCategoryList: string[],
        selectTagList: any[],
        mdContent: string,
        htmlContent: string,
        isshow: string,
        imgList: string[]
    }

    //显示的表单内容
    let formData = reactive<data>({
        title: '',
        selectCategoryList: [],
        selectTagList: [],
        mdContent: '',
        htmlContent: '',
        isshow: "true",
        imgList: []
    })

    //上传的表单内容
    let submitForm = reactive<addArticle>({
        id: -1,
        title: '',
        date: -1,
        categoryId: -1,
        oldCategoryId: -1,
        tagId: '',
        addTag: [],
        minusTag: [],
        content: '',
        htmlContent: '',
        isshow: 'true',
        author: '',
        imgList: []
    })

    //级联选择器是否可点击
    let disabled = ref(false)

    //文章发布是否成功(0为未点击，1为提交中)
    let isSubmit = ref(0)

    onMounted(() => {
        isSubmit.value = 0
        //监听浏览器刷新(注意点及步骤和关于页一样)
        window.addEventListener("beforeunload", addEvent, true)
        //利用监视属性在离开编辑文章页面时将表单清空，避免在写文章时编辑文章的表单未清空
        watch(() => route.query.editArticleId, (res) => {
            //route.query.editArticleId变化代表进入或者离开编辑页，如果route.query.editArticleId为undefined就一定是离开编辑页
            if (!res) {
                console.log('离开编辑文章页面，清空表单');
                clearForm()
                formData.imgList = []
                //把离开前的编辑文章页对应文章的标签加减数组清空，避免影响下一次编辑的文章
                submitForm.addTag = []
                submitForm.minusTag = []
            }
        })
    })

    onActivated(() => {
        let editArticleId = parseInt(route.query.editArticleId as string)
        //如果是编辑就从仓库获取对应数据并赋值给表单数据
        if (editArticleId) {
            let article = articleList.value.filter((item: any) => item.id === editArticleId)
            let { title, categoryId, tagId, content, htmlContent, isshow, imgList } = article[0]
            //处理分类[类名]
            let selectCategory: string[] = []
            selectCategory.push(categoryList.value.filter((category: any) => category.id === categoryId)[0].name)
            //处理标签[[标签名],[标签名]]
            let Tag = tagId.split('、')
            let selectTag: any[] = []
            Tag.forEach((tag: any) => {
                let tagName: string[] = []
                tagName.push(tagList.value.filter((tags: any) => tags.id === parseInt(tag))[0].name)
                selectTag.push(tagName)
            })
            formData.title = title
            formData.selectCategoryList = selectCategory
            formData.selectTagList = selectTag
            formData.mdContent = content
            formData.htmlContent = htmlContent
            formData.isshow = isshow
            formData.imgList = JSON.parse(imgList)
        }
        //因为token失效发布文章失败再次进入时使用上一次的表单(这里是mounted和activated两个周期里面最后执行的，可以确保能替换表单数据)
        const oldFormData = JSON.parse(localStorage.getItem('blogAddArticleFormData') as string)

        if (oldFormData) {
            const { title, selectCategoryList, selectTagList, mdContent, htmlContent, isshow, imgList } = oldFormData
            formData.title = title
            formData.selectCategoryList = selectCategoryList
            formData.selectTagList = selectTagList
            formData.mdContent = mdContent
            formData.htmlContent = htmlContent
            formData.isshow = isshow
            formData.imgList = imgList
        }
    })

    //组件卸载前
    onBeforeUnmount(() => {
        //在组件卸载前移除当前组件的旧的监听事件
        window.removeEventListener("beforeunload", addEvent, true)
    })

    //添加事件回调函数
    const addEvent = async () => {
        //因为token失效发布文章失败再次进入时使用上一次的表单
        let oldFormData = JSON.parse(localStorage.getItem('blogAddArticleFormData') as string)
        //在提交失败重新进入页面时如果在点击提交之前点击刷新就删除localstorage
        if (oldFormData) {
            localStorage.removeItem('blogAddArticleFormData')
        }
        let editArticleId = route.query.editArticleId
        let list = formData.imgList
        //没有处于编辑文章状态就删除所有formData.imgList图片，处于编辑文章状态就删除新添加的图片
        //如果刷新前处于编辑文章状态，就找出编辑文章新添加的图片，删除新添加的图片组成的数组
        if (editArticleId) {
            //需要注意类型(editArticleId是字符串需要转换为number，从仓库获取的图片列表是字符串，需要JSON.parse转换为数组)
            let articleImgList = JSON.parse(articleList.value.filter((item: any) => item.id === Number(editArticleId))[0].imgList)
            if (articleImgList.length != formData.imgList.length && formData.imgList.length > 0) {
                //找出编辑文章新添加的图片
                list = formData.imgList.filter((img: any) => {
                    return articleImgList.indexOf(img) === -1
                })
            } else {
                //如果当前的图片数组长度和仓库保存的一样那就将list置空避免错误删除图片
                list = []
            }
        }
        if (list.length > 0) {
            //删除刷新前未被删除的图片
            let res = await deleteImgList(list)
            if (res.code === 200) {
                console.log(res.msg);
            }
        }
    }

    //获取文章列表
    const articleList = computed(() => {
        return store.getters['articles/articleList']
    })

    //获取分类列表
    const categoryList = computed(() => {
        return store.getters['categories/CategoriesList']
    })
    //获取标签列表
    const tagList = computed(() => {
        return store.getters['tags/tagList']
    })


    //获取昵称
    const userName = computed(() => {
        return store.getters['user/getName']
    })

    //分类选择器内容
    const selectCategory = computed(() => {
        let list = categoryList.value.map((item: any) => {
            return {
                id: item.id,
                value: item.name,
                label: item.name,
                color: item.color
            }
        })
        return list
    })
    //标签选择器内容
    const selectTag = computed(() => {
        let list = tagList.value.map((item: any) => {
            return {
                id: item.id,
                value: item.name,
                label: item.name,
                color: item.color
            }
        })
        return list
    })

    //自定义校验标签选择框
    const validateLabel = (rule: any, value: any, callback: any) => {
        // value获取输入框的值
        // 有 value 值才校验，不然提交的时候会报错
        if (value && value.length > 3) {
            disabled.value = true; // 禁止点击
            callback(new Error("最多可选3个标签"));
        } else {
            // 校验通过放行
            callback();
            disabled.value = false;
        }
    };

    //自定义文本编辑器的校验
    const validateContent = (rule: any, value: any, callback: any) => {
        //判断提交表单的编辑器部分内容是否存在
        if (formData.mdContent && formData.htmlContent) {
            // 有内容则放行
            callback();
        } else {
            callback(new Error("请输入文章内容"));
        }
    };

    //表单校验规则
    const rules = reactive<FormRules>({
        // 表单校验
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        // 表单校验
        selectCategoryList: [{ required: true, message: "请选择分类", trigger: "change" }],
        //自定义标签校验参数
        selectTagList: [
            { required: true, message: "请选择标签", trigger: "blur" },
            { validator: validateLabel, trigger: "change" },
        ],
        //自定义编辑器校验
        content: [{ validator: validateContent, trigger: "change" }],
    })

    //清空表单
    const clearForm = () => {
        formData.title = ''
        formData.selectCategoryList = []
        formData.selectTagList = []
        formData.mdContent = ''
        formData.htmlContent = ''
        formData.isshow = 'true'
    }

    return {
        ruleFormRef,
        formData,
        submitForm,
        disabled,
        isSubmit,
        articleList,
        categoryList,
        tagList,
        userName,
        selectCategory,
        selectTag,
        rules,
        clearForm
    }
}