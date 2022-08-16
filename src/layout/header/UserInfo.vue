<template>
    <el-dropdown placement="bottom-start">
        <span class="el-dropdown-link">
            <img class="userimg" :src="`${avatar}`" />
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
<script setup lang='ts'>
import { ref, computed } from 'vue'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const avatar = computed(() => {
    return store.getters['user/getAvatar']
})
//退出登录
const loginOut = () => {
    //清除localStorage信息并跳转登录页
    localStorage.removeItem('blogToken')
    localStorage.removeItem('blogMes')
    router.replace('/login')
}
</script>
<style scoped lang='scss'>
.el-dropdown-link {
    display: inline-block;
    height: 42px;
    width: 42px;
    border-radius: 50%;
    overflow: hidden;

    .userimg {
        width: 100%;
        height: 100%;
    }
}
</style>