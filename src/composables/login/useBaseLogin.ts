//登录组件基础数据定义
import { ref, reactive } from 'vue'
import type { FormRules, FormInstance } from 'element-plus'
import { loginType } from '@/network/api/user/UserModel'
export default function useBaseLogin() {
    //图片显示
    const loginImg = ref<string>('one')
    //登录表单ref（通过ref绑定dom元素）
    const loginFormRef = ref<FormInstance>();
    //表单数据
    const formLabel = reactive<loginType>({
        name: '',
        password: ''
    })
    //表单验证规则
    const rules = reactive<FormRules>({
        name: [{
            required: true,
            message: '不要忘了你的名字哦~',
            trigger: 'change'
        }],
        password: [{
            required: true,
            message: '密码是一定不能忘记的~',
            trigger: 'change'
        }]
    })
    return {
        loginImg,
        loginFormRef,
        formLabel,
        rules
    }
}