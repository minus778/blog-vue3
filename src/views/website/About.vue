<template>
    <div class="about">
        <mavon-editor ref="md" v-model="mdContent" placeholder="写些什么呢..." class="mavon" @change="getMdHtml"
            @imgAdd="uploadContentImg" @imgDel="delContentImg" />
        <el-button type="primary" :loading="isSubmit === 1" class="submit" @click="editAbout">发布
        </el-button>
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useStore } from '@/store'
import { getAbout, editAboutContent } from '@/network/api/user/user'
import { uploadImg, deleteImg, deleteImgList } from '@/network/api/article/article'

const store = useStore()

//发布是否成功(0为未点击，1为提交中)
let isSubmit = ref(0)
//mavon编辑器dom
const md = ref(null)
//记录md
let mdContent = ref('')
//记录html
let htmlContent = ref('')
//记录当前上传保存了的图片
let uploadImgList = ref<string[]>([])

onMounted(() => {
    let oldFormData = JSON.parse(localStorage.getItem('blogEditAbout') as string)
    //localStorage存在则是重新登录进来的，不用重新获取数据
    if (oldFormData) {
        mdContent.value = oldFormData.mdContent
        uploadImgList.value = oldFormData.uploadImgList

    } else {
        getAboutMes()
    }
    //重新登录后进入会执行两次？
    //由于监听的是页面刷新，而页面刷新后会清空监听，所以不用移除监听，每次组件只会存在一个监听
    //重点注意：重新登录后进入会执行两次的原因：token失效后再登录不会刷新页面，但是组件会重新加载，也就是会重新执行一次onMounted，在token失效前组件就存在一个监听事件了，登录之后再次执行onMounted而没有刷新页面就会再创建一个监听事件，导致存在两个监听事件，所以刷新会执行两次一样的监听事件回调
    //解决办法就是判断是否是token失效进来的，如果是就不进行监听
    //还有一个问题就是token失效前监听事件监听的是销毁之前的那个组件，登录成功后的新组件的值修改了不会同步到监听事件的回调中，这个监听事件的回调只对被销毁的那个组件有效，解决办法就是使用新的监听事件，移除旧的监听事件
    //总结：要解决上面两个bug，就需要在每次进入组件时都添加一个新的监听事件，但是就需要在组件卸载之前移除旧的监听事件，确保每次组件只有一个最新的监听事件
    //注意点：要想移除监听事件，监听事件的回调函数必须是外部函数，并且添加和移除的回调函数必须一致
    window.addEventListener("beforeunload", addEvent, true)
})

//组件卸载前
onBeforeUnmount(() => {
    //在组件卸载前移除当前组件的旧的监听事件
    window.removeEventListener("beforeunload", addEvent, true)
})

//添加事件监听回调
const addEvent = async () => {
    let oldFormData = JSON.parse(localStorage.getItem('blogEditAbout') as string)
    //在提交失败重新进入页面时如果在点击提交之前点击刷新就删除localstorage
    if (oldFormData) {
        localStorage.removeItem('blogEditAbout')
    }
    //刷新就删除上传了但是没提交的图片
    if (uploadImgList.value.length > 0) {
        //删除刷新前未被删除的图片
        let res = await deleteImgList(uploadImgList.value)
        if (res.code === 200) {
            console.log(res.msg);
        }
    }
}

//获取后端url
const websiteUrl = computed(() => {
    return store.getters['user/getWebsiteUrl']
})

//获取关于页内容
const getAboutMes = async () => {
    let res = await getAbout()
    console.log('获取到关于页的信息：', res);
    if (res.code === 200) {
        mdContent.value = res.data.content
    } else {
        ElMessage.error('请求错误')
    }
}

//修改关于页内容
const editAbout = async () => {
    isSubmit.value = 1
    //保存localStorage，避免token失效数据被清空
    localStorage.setItem('blogEditAbout', JSON.stringify({ mdContent: mdContent.value, uploadImgList: uploadImgList.value }))
    let res = await editAboutContent(mdContent.value)
    if (res.code === 200) {
        //清空localStorage
        localStorage.removeItem('blogEditAbout')
        isSubmit.value = 0
        uploadImgList.value = []
        ElMessage({
            message: res.msg,
            type: 'success'
        })
    } else {
        isSubmit.value = 0
        ElMessage.error('请求错误')
    }
}

//转换编辑器内容
const getMdHtml = (mdcontent: string, htmlcontent: string) => {
    // console.log('mdcontent', mdcontent)
    // console.log('htmlcontent', htmlcontent)
    mdContent.value = mdcontent;
    htmlContent.value = htmlcontent;
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
        uploadImgList.value.push(res.data.pathUrl);
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
        uploadImgList.value = uploadImgList.value.filter(item => {
            return item != delFileUrl
        })
    }
}

</script>

<style scoped lang='scss'>
.about {
    padding: 20px;

    .mavon {
        width: 100%;
        height: 500px;
        margin-bottom: 30px;
    }

    .submit {
        width: 200px;
    }
}
</style>