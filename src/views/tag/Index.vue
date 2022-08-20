<template>
    <category-and-tag v-if="tagIsOver" CTname="标签" :CTlist="tagList" :CTdelete="CTdelete" :CTadd="CTadd"
        :CTedit="CTedit">
    </category-and-tag>
</template>

<script setup lang='ts'>
import CategoryAndTagVue from '@/components/CategoryAndTag.vue';
import { ref, computed } from 'vue'
import { useStore } from '@/store'

const store = useStore()
//获取分类列表(深拷贝-不变)
let tagList = computed(() => {
    return store.getters['tags/tagList']
})
//获取标签列表请求是否结束
const tagIsOver = computed(() => {
    return store.state.tags.isOverReq
})
let CTdelete = ref('tags/deleteTagItem')
let CTadd = ref('tags/addTagItem')
let CTedit = ref('tags/editTagItem')

</script>

<style scoped lang='scss'>
</style>