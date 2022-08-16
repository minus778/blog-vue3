<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item in breadList" :to="item.path">{{ item.meta.title }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup lang='ts'>
//通过route获取当前路由的meta信息，将首页的meta拼接上去组成完整的面包屑
import { ref, Ref, watch } from 'vue'
import { useRoute, RouteLocationMatched } from 'vue-router'
const route = useRoute()
//泛型类型对ref数据类型进行限制
const breadList: Ref<RouteLocationMatched[]> = ref([])
const getBredcrumb = () => {
    //route.matched获取当前路由的完整路径记录
    let pathList = route.matched.filter((item) => item.meta && item.meta.title)
    //如果没有首页信息就添加
    let home = pathList[0] && pathList[0].path !== '/home' ? [{ path: '/home', meta: { title: '首页' } } as any] : []
    breadList.value = home.concat(pathList)
}
getBredcrumb()
//监听route信息变化，route变化就调用函数重新获取面包屑信息
watch(() => route.path, () => {
    getBredcrumb()
})


</script>

<style scoped lang='scss'>
</style>