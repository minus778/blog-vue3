//关于页整体数据及逻辑
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getAbout, editAboutContent } from '@/network/api/user/user'
import { deleteImgList } from '@/network/api/article/article'
export default function useAbout() {
    //发布是否成功(0为未点击，1为提交中)
    let isSubmit = ref(0)

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
            htmlContent.value = oldFormData.htmlContent
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

    //获取关于页内容
    const getAboutMes = async () => {
        let res = await getAbout()
        console.log('获取到关于页的信息：', res);
        if (res.code === 200) {
            mdContent.value = res.data.content
            htmlContent.value = res.data.htmlContent
        } else {
            ElMessage.error('请求错误')
        }
    }

    //修改关于页内容
    const editAbout = async () => {
        isSubmit.value = 1
        //保存localStorage，避免token失效数据被清空
        localStorage.setItem('blogEditAbout', JSON.stringify({ mdContent: mdContent.value, htmlContent: htmlContent.value, uploadImgList: uploadImgList.value }))
        let data = { mdContent: mdContent.value, htmlContent: htmlContent.value }
        let res = await editAboutContent(data)
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

    return {
        isSubmit,
        mdContent,
        htmlContent,
        uploadImgList,
        editAbout
    }
}