<template>
    <category-and-tag v-if="categoryIsOver" CTname="分类" :CTlist="categoryList" :CTdelete="CTdelete" :CTadd="CTadd"
        :CTedit="CTedit">
    </category-and-tag>
</template>

<script setup lang='ts'>
import CategoryAndTagVue from '@/components/CategoryAndTag.vue';
import { ref, computed } from 'vue'
import { useStore } from '@/store'

const store = useStore()
//获取分类列表(深拷贝-不变)
let categoryList = computed(() => {
    return store.getters['categories/CategoriesList']
})
//获取分类列表请求是否结束
const categoryIsOver = computed(() => {
    return store.state.categories.isOverReq
})
let CTdelete = ref('categories/deleteCategoryItem')
let CTadd = ref('categories/addCategoryItem')
let CTedit = ref('categories/editCategoryItem')

</script>

<style scoped lang='scss'>
</style>