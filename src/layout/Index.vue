<template>
    <div class="main">
        <el-container>
            <el-aside width="auto">
                <MenuBar></MenuBar>
            </el-aside>
            <el-container>
                <el-header class="headers">
                    <Header></Header>
                </el-header>
                <el-main class="main">
                    <Tabs class="tab"></Tabs>
                    <!-- 二级路由 -->
                    <router-view v-slot="{ Component }">
                        <!-- 通过路由的meta来实现缓存，解决了setup语法糖不能设置name来使用include的问题 -->
                        <keep-alive>
                            <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.name" />
                        </keep-alive>
                        <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.name" />
                    </router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>


<script setup lang='ts'>
import MenuBar from './menu/MenuBar.vue'
import Header from '@/layout/header/Header.vue'
import Tabs from '@/layout/tabs/Tabs.vue'
</script>

<style scoped lang='scss'>
.main {
    height: 100%;

    .el-container {
        height: 100%;

        .headers {
            height: 50px;
            line-height: 50px;
            padding-left: 0;
            margin-left: 20px;
            box-shadow: 0px 10px 10px -10px #e4e7ed;
            z-index: 100;
        }

        main {
            padding-top: 0;
            padding-bottom: 13px;
        }
    }
}
</style>