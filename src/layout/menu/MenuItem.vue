<template>
    <template v-for="menu in menuList" :key="menu.path">
        <!-- 有子级菜单 -->
        <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.path" :key="menu.path">
            <!-- 子级菜单 -->
            <template #title>
                <el-icon color="#000" size="22">
                    <!-- 使用阿里字体图标 -->
                    <i :class="['iconfont ' + menu.meta.icon]"></i>
                </el-icon>
                <span>{{ menu.meta.title }}</span>
                <div class="num" v-if="menu.meta.title === '消息' && articleReadNum + mesReadNum != 0">
                    <span v-if="articleReadNum + mesReadNum <= 99">{{ articleReadNum + mesReadNum }}</span>
                    <div v-else>
                        <span class="more">99</span>
                        <span class="jia">+</span>
                    </div>
                </div>
            </template>
            <!-- 递归调用自身组件，遍历子级菜单 -->
            <menu-item :menuList="menu.children"></menu-item>
        </el-sub-menu>
        <!-- 一级菜单，没有子级菜单 -->
        <el-menu-item style="color: #f4f4f5" v-else :index="menu.path">
            <el-icon color="#000" size="22">
                <i :class="['iconfont ' + menu.meta.icon]"></i>
            </el-icon>
            <template #title>
                <span>{{ menu.meta.title }}</span>
                <div v-if="menu.meta.title === '文章评论' && articleReadNum != 0" class="num">
                    <span v-if="articleReadNum <= 99">{{ articleReadNum }}</span>
                    <div v-else>
                        <span class="more">99</span>
                        <span class="jia">+</span>
                    </div>
                </div>
                <div v-if="menu.meta.title === '留言' && mesReadNum != 0" class="num">
                    <span v-if="mesReadNum <= 99">{{ mesReadNum }}</span>
                    <div v-else>
                        <span class="more">99</span>
                        <span class="jia">+</span>
                    </div>
                </div>
            </template>
        </el-menu-item>
    </template>
</template>

<script setup lang='ts'>
import { useStore } from '@/store'
import { computed } from 'vue'

const store = useStore()
//获取文章评论未读消息数量
let articleReadNum = computed(() => {
    return store.getters['comments/articleReadNum']
})
//获取留言未读消息数量
let mesReadNum = computed(() => {
    return store.getters['comments/mesReadNum']
})

defineProps(['menuList'])
</script>

<style scoped lang='scss'>
.num {
    display: inline-block;
    width: 21px;
    height: 21px;
    line-height: 21px;
    border-radius: 50%;
    background-color: red;
    color: white;
    font-size: 12px;
    text-align: center;
    position: absolute;
    right: 40px;

    .more {
        position: absolute;
        left: 1px;
    }

    .jia {
        position: absolute;
        top: -4px;
        left: 13px;
    }
}
</style>