<template>
    <Comments :commentList="MescommentList" commentName="留言"></Comments>
</template>

<script setup lang='ts'>
import Comments from '@/components/Comments.vue'
import { useStore } from '@/store'
import { computed } from 'vue'

const store = useStore()
//获取留言数据（这个数据作为该组件处理的文章数据的保存点需要在表格排序的原始数据用到且是仓库数据，不能被改变，但由于是复杂数据，在其他地方直接赋值是浅拷贝，会修改当前数据，所以在赋值时要将该数据转为深拷贝再使用避免被修改）
let MescommentList = computed(() => {
    let list = store.getters['comments/leaveMessage']
    return list
})
</script>

<style scoped lang='scss'>
</style>