<template>
    <div class="header">
        <div class="left">
            <Collapse></Collapse>
            <Bread></Bread>
        </div>
        <UserInfo></UserInfo>
    </div>
</template>

<script setup lang='ts'>
import Collapse from '@/layout/header/Collapse.vue'
import Bread from "@/layout/header/Bread.vue"
import UserInfo from './UserInfo.vue';
</script>

<style scoped lang='scss'>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    line-height: 50px;

    .left {
        display: flex;
        height: 100%;
        align-items: center;
    }
}
</style>