<template>
    <div class="addArticle">
        <h2 class=topTitle>{{ $route.query.editArticleId ? '编辑文章' : '写文章' }}</h2>
        <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="auto" class="demo-ruleForm">
            <el-form-item prop="title">
                <el-input v-model="formData.title" placeholder="标题" maxlength="30" show-word-limit type="text"
                    :prefix-icon="EditPen" />
            </el-form-item>
            <div class="choose-select">
                <el-form-item prop="selectCategoryList" :style="{ width: '49%' }">
                    <el-cascader v-model="formData.selectCategoryList" :options="selectCategory" placeholder="选择分类"
                        style="width: 100%;" clearable>
                        <template #default="{ node, data }">
                            <el-tag class="ml-2"
                                :style="{ color: data.color, backgroundColor: colorRgb(data.color, 0.1), border: `1px solid ${colorRgb(data.color, 0.2)}`, whiteSpace: 'wrap' }">
                                {{
                                        data.value
                                }}
                            </el-tag>
                        </template>
                    </el-cascader>
                </el-form-item>
                <el-form-item prop="selectTagList" :style="{ width: '49%' }">
                    <el-cascader v-model="formData.selectTagList" :options="selectTag" placeholder="选择标签"
                        style="width: 100%;" clearable :props="{ multiple: true }" :disabled="disabled">
                        <template #default="{ node, data }">
                            <el-tag class="ml-2"
                                :style="{ color: data.color, backgroundColor: colorRgb(data.color, 0.1), border: `1px solid ${colorRgb(data.color, 0.2)}`, whiteSpace: 'wrap' }">
                                {{
                                        data.value
                                }}
                            </el-tag>
                        </template>
                    </el-cascader>
                </el-form-item>
            </div>
            <el-form-item prop="content">
                <mavon-editor ref="md" :autofocus="false" v-model="formData.mdContent" placeholder="写些什么呢..."
                    class="mavon" @change="getMdHtml" @imgAdd="uploadContentImg" @imgDel="delContentImg" />
            </el-form-item>
            <el-form-item prop="isShow">
                <el-switch :model-value="formData.isshow === 'true'" active-text="发布文章" inactive-text="隐藏文章"
                    @click="formData.isshow === 'true' ? formData.isshow = 'false' : formData.isshow = 'true'" />
            </el-form-item>
        </el-form>
        <div class="btn">
            <el-button type="primary" :loading="isSubmit === 1" class="submit" @click="submitArticle(ruleFormRef)">
                {{ $route.query.editArticleId ? '完成编辑' : '发布文章' }}
            </el-button>
            <el-button type="danger" class="clear" @click="clearForm">清空
            </el-button>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { ref, reactive, computed, onMounted, onActivated, onBeforeUnmount } from 'vue'
import { addArticle } from '@/network/api/article/ArticleModel'
import { EditPen } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useStore } from '@/store'
import { useRouter, useRoute } from 'vue-router'
import useColor from '@/hooks/useColor'
import { uploadImg, deleteImg, deleteImgList } from '@/network/api/article/article'

const store = useStore()
const route = useRoute()
const router = useRouter()
const { colorRgb } = useColor()
//表单dom
const ruleFormRef = ref<FormInstance>()
//mavon编辑器dom
const md = ref(null)

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
})

onActivated(() => {
    let editArticleId = parseInt(route.query.editArticleId as string)
    //如果是编辑就从仓库获取对应数据并赋值给表单数据
    if (editArticleId) {
        let article = articleList.value.filter((item: any) => item.id === editArticleId)
        let { title, categoryId, tagId, content, isshow, imgList } = article[0]
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
        formData.isshow = isshow
        formData.imgList = JSON.parse(imgList)
    } else {
        clearForm()
        formData.imgList = []
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

//获取后端url
const websiteUrl = computed(() => {
    return store.getters['user/getWebsiteUrl']
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
//转换编辑器内容
const getMdHtml = (mdContent: string, htmlContent: string) => {
    // console.log('mdContent', mdContent)
    // console.log('htmlContent', htmlContent)
    formData.mdContent = mdContent;
    formData.htmlContent = htmlContent;
}

//发布文章
const submitArticle = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            isSubmit.value = 1
            submitForm.title = formData.title
            submitForm.date = +new Date()
            submitForm.content = formData.mdContent
            submitForm.isshow = formData.isshow
            submitForm.author = userName.value
            submitForm.imgList = formData.imgList
            //处理标签id
            let tagListId: number[] = [];
            formData.selectTagList.forEach((item: any) => {
                let tag = tagList.value.filter((items: any) => {
                    return items.name === item[0]
                })
                tagListId.push(tag[0].id)
            });
            submitForm.tagId = tagListId.join('、')
            //处理分类id
            submitForm.categoryId = categoryList.value.filter((item: any) => {
                return item.name === formData.selectCategoryList[0]
            })[0].id;

            console.log('校验通过!', formData)
            console.log('提交表单：', submitForm);
            //localStorage存储显示的表单数据，避免文章发布失败(token过期)跳转到登录页再回来后数据丢失的问题
            localStorage.setItem('blogAddArticleFormData', JSON.stringify(formData))

            if (route.query.editArticleId) {
                console.log('编辑文章请求');
                editArticle()

            } else {
                console.log('新增文章请求');
                addNewArticle()
            }

        } else {
            console.log('校验不通过!')
            return false
        }
    })
}

//新增文章
const addNewArticle = () => {
    store.dispatch('articles/addArticleItem', submitForm).then(res => {
        if (res.code === 200) {
            isSubmit.value = 0
            //文章发布成功删除localStorage，表示本次提交没有问题
            localStorage.removeItem('blogAddArticleFormData')

            //文章添加成功将对应的分类文章数加一
            store.commit('categories/addArticleNum', submitForm.categoryId)
            //文章添加成功将对应的标签文章数加一
            let tagIdList = submitForm.tagId?.split('、').map(ids => parseInt(ids))
            store.commit('tags/addArticleNum', tagIdList)
            ElMessage({
                message: res.msg,
                type: 'success'
            })
            //清空表单
            clearForm()
            //本篇文章图片列表记录完毕后清空
            formData.imgList = []
        }
    }).catch(err => {
        isSubmit.value = 0
        console.log(err)
        ElMessage.error('请求出错')
    })
}

//编辑文章
const editArticle = () => {
    let editArticleId = parseInt(route.query.editArticleId as string)
    submitForm.id = editArticleId
    //原始的文章表单
    let oldArticleForm = articleList.value.filter((item: any) => item.id === editArticleId)[0]
    //判断文章分类是否有变化
    if (submitForm.categoryId === oldArticleForm.categoryId) {
        submitForm.oldCategoryId = -1
    } else {
        submitForm.oldCategoryId = oldArticleForm.categoryId
    }
    //判断文章标签是否有变化
    if (submitForm.tagId === oldArticleForm.tagId) {
        submitForm.addTag = []
        submitForm.minusTag = []
    } else {
        let newList = submitForm.tagId?.split('、')
        let oldList = oldArticleForm.tagId.split('、')
        //找出需要加一的
        newList?.forEach((tag: any) => {
            if (oldList.indexOf(tag) === -1) {
                submitForm.addTag?.push(Number(tag))
            }
        })
        //找出需要减一的
        oldList.forEach((tag: any) => {
            if (newList?.indexOf(tag) === -1) {
                submitForm.minusTag?.push(Number(tag))
            }
        })
    }
    console.log('编辑文章表单：', submitForm);
    store.dispatch('articles/editArticleItem', submitForm).then(res => {
        if (res.code === 200) {
            isSubmit.value = 0
            //文章修改成功删除localStorage，表示本次提交没有问题
            localStorage.removeItem('blogAddArticleFormData')
            //编辑成功
            ElMessage({
                message: res.msg,
                type: 'success'
            })
            //对应分类数量加一/减一
            if (submitForm.oldCategoryId != -1) {
                //加一
                store.commit('categories/addArticleNum', submitForm.categoryId)
                //减一
                store.commit('categories/minusArticleNum', submitForm.oldCategoryId)
            }
            //对应标签数量加一/减一
            //加一
            if ((submitForm.addTag as number[]).length > 0) {
                store.commit('tags/addArticleNum', submitForm.addTag)
            }
            //减一
            if ((submitForm.minusTag as number[]).length > 0) {
                store.commit('tags/minusArticleNum', submitForm.minusTag)
            }
            router.replace({
                path: '/articleList'
            })
            //清空表单
            clearForm()
            //本篇文章图片列表记录完毕后清空
            formData.imgList = []
            //编辑文章成功后将标签加减数组清空
            submitForm.addTag = []
            submitForm.minusTag = []
        }
    }).catch(err => {
        isSubmit.value = 0
        console.log(err)
        ElMessage.error('请求出错')
    })

}

//清空表单
const clearForm = () => {
    formData.title = ''
    formData.selectCategoryList = []
    formData.selectTagList = []
    formData.mdContent = ''
    formData.isshow = 'true'
}

//点击编辑器的上传图片 (图片位置编号, File对象)
const uploadContentImg = async (pos: any, file: any) => {
    console.log("上传内容图片", file);
    //第一步.将图片上传到服务器
    var fd = new FormData();
    fd.append("file", file);
    let res = await uploadImg(fd)
    if (res.code === 200) {
        //添加一张图片
        formData.imgList.push(res.data.pathUrl);
        // 第二步.将返回的url替换到文本原位置! [...](0) -> ![...](url)
        (md.value as any).$img2Url(pos, websiteUrl.value + res.data.pathUrl);
    }
}

//点击编辑器的删除图片
const delContentImg = async (urlAndFileArr: any) => {
    const fileUrl = urlAndFileArr[0]; // 文件URL
    const file = urlAndFileArr[1]; // File对象
    //处理一下图片url
    let delFileUrl = '/imgs' + fileUrl.split('/imgs')[1]
    console.log("正确的图片url:", delFileUrl);
    let res = await deleteImg(delFileUrl);
    if (res.code === 200) {
        console.log(res.msg);
        //去掉删除的图片
        formData.imgList = formData.imgList.filter(item => {
            return item != delFileUrl
        })
    }
}

</script>

<style scoped lang='scss'>
.addArticle {
    padding: 20px;

    .topTitle {
        margin-bottom: 10px;
    }

    .choose-select {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .mavon {
        width: 100%;
        height: 500px;
    }

    .btn {

        .submit,
        .clear {
            width: 200px;
        }
    }
}
</style>