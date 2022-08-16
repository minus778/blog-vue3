//网站信息模块基础数据
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from '@/store'
import type { FormInstance, FormRules } from 'element-plus'
import { deleteImg } from '@/network/api/user/user'
export default function useBaseMes() {
    const store = useStore()
    //表单dom
    const ruleFormRef = ref<FormInstance>()
    //发布是否成功(0为未点击，1为提交中)
    let isSubmit = ref(0)

    //表单数据(由于computed返回的复杂数据v-model不能修改，就这样定义)，包含用户头像（临时保存，如果点击提交就把保存的头像存入数据库和仓库）
    let formData = ref<any>({})

    //获取仓库网站信息
    const blogMes = computed(() => {
        return store.getters['user/getBlogMes']
    })

    onMounted(() => {
        let oldFormData = JSON.parse(localStorage.getItem('blogWebsiteFormData') as string)
        //初始化表单数据(深拷贝，主要是为了区分初始头像和当前头像)
        //如果存在表单数据的localStorage就代表上一次提交失败了，登录后重新跳转到该组件就使用localStorage存储的上一次的表单数据，相当于继续了上一次的操作
        formData.value = oldFormData || JSON.parse(JSON.stringify(blogMes.value))
        //监听浏览器刷新(主要是防止刷新浏览器临时图片在后端不会被删除的情况)
        //(注意点及步骤和关于页一样)
        window.addEventListener("beforeunload", addEvent, true)
    })

    //组件卸载前
    onBeforeUnmount(() => {
        //在组件卸载前移除当前组件的旧的监听事件
        window.removeEventListener("beforeunload", addEvent, true)
    })

    //添加事件回调函数
    const addEvent = async () => {
        let oldFormData = JSON.parse(localStorage.getItem('blogWebsiteFormData') as string)
        delAvatar()
        //在提交失败重新进入页面时如果在点击提交之前点击刷新就删除localstorage
        if (oldFormData) {
            localStorage.removeItem('blogWebsiteFormData')
        }
    }

    //表单校验规则
    const rules = reactive<FormRules>({
        avatar: [
            { required: true, message: '请上传头像', trigger: 'blur' }
        ],
        name: [
            { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        password: [
            {
                required: true,
                message: '请输入密码',
                trigger: 'blur',
            },
        ],
        introduce: [
            {
                required: true,
                message: '请输入网站介绍',
                trigger: 'blur',
            },
        ],
        desc: [
            {
                required: true,
                message: '请输入网站描述',
                trigger: 'blur',
            },
        ],
        github: [
            {
                required: true,
                message: '请输入github地址',
                trigger: 'blur',
            },
        ],
        gitee: [
            {
                required: true,
                message: '请输入gitee地址',
                trigger: 'blur',
            },
        ],
        recode: [
            {
                required: true,
                message: '请输入网站备案号',
                trigger: 'blur',
            },
        ],
        websiteAddress: [
            {
                required: true,
                message: '请输入后端url',
                trigger: 'blur',
            },
        ]
    })

    //删除头像
    //在请求拦截中将删除头像的请求不带上token，避免上传请求后token失效导致删除图片失败
    const delAvatar = async () => {
        //判断上一张头像如果是项目正在使用的，就不删除，不然就删除（临时的，不点提交就不作数）
        if (formData.value.avatar != blogMes.value.avatar) {
            let delres = await deleteImg(formData.value.avatar)
            if (delres.code === 200) {
                console.log(delres.msg);
            }
        }
    }

    return {
        ruleFormRef,
        isSubmit,
        formData,
        blogMes,
        rules,
        delAvatar
    }
}

