<template>
    <el-icon class="iconFold" @click="changeIcon">
        <component :is="status ? Fold : Expand" />
    </el-icon>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useStore } from '@/store'
import { Fold, Expand } from '@element-plus/icons-vue'

const store = useStore()

//将state和getters的数据在计算属性中使用就是响应式的，仓库中state/getters的值改变就会触发计算属性修改值
const status = computed(() => {
    return store.getters['menu/getCol']
})
//搜索按钮切换事件
const changeIcon = () => {
    //getters返回的是ref类型的数据，需要使用.value来获取
    store.commit('menu/setCollapse', status.value)
}
</script>

<style scoped lang='scss'>
@import '@/assets/css/controller.scss';

.iconFold {
    font-size: 20px;
    color: #303133;
    cursor: pointer;
    margin-right: 15px;

    &:hover {
        color: $textColor;
    }
}
</style>