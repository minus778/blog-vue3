<template>
    <menu-logo class="layout-logo" :collapsed="isCollapse" :name="name"></menu-logo>
    <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" background-color="#ffffff" unique-opened router
        :collapse="isCollapse">
        <menu-item :menuList="menuList"></menu-item>
    </el-menu>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
import MenuItem from '@/layout/menu/MenuItem.vue'
import MenuLogo from '@/layout/menu/MenuLogo.vue'

const route = useRoute()
const store = useStore()
//菜单路由
const menuList = reactive([
    {
        path: '/home',
        meta: {
            title: '首页',
            icon: "icon-shouye"
        }
    },
    {
        path: '/article',
        meta: {
            title: '文章',
            icon: "icon-navicon-wzgl"
        },
        children: [
            {
                path: '/articleList',
                meta: {
                    title: '文章列表',
                    icon: "icon-huokewenzhang"
                }
            },
            {
                path: '/addArticle',
                meta: {
                    title: '写文章',
                    icon: "icon-bianjiwenzhang_huaban"
                }
            }
        ]
    },
    {
        path: '/comment',
        meta: {
            title: '消息',
            icon: "icon-pinglun"
        },
        children: [
            {
                path: '/articleComment',
                meta: {
                    title: '文章评论',
                    icon: "icon-pinglun2"
                }
            },
            {
                path: '/leaveMessage',
                meta: {
                    title: '留言',
                    icon: "icon-pinglun1"
                }
            },
        ]
    },
    {
        path: '/category',
        meta: {
            title: '分类列表',
            icon: "icon-fenlei"
        }
    },
    {
        path: '/tag',
        meta: {
            title: '标签列表',
            icon: "icon-24gl-tags3"
        }
    },
    {
        path: '/website',
        meta: {
            title: '网站',
            icon: "icon-guanfangwangzhan"
        },
        children: [
            {
                path: '/about',
                meta: {
                    title: '关于我',
                    icon: "icon-guanyuwo"
                }
            },
            {
                path: '/message',
                meta: {
                    title: '网站信息',
                    icon: "icon-guanyu"
                }
            }
        ]
    }
])
//是否折叠菜单
const isCollapse = computed(() => {
    return store.getters['menu/getCol']
})
//使用computed来使activeIndex变为响应式，route变化activeIndex会随着变化
const activeIndex = computed(() => {
    return route.path
})
//获取名称
const name = computed(() => {
    return store.getters['user/getName']
})
</script>

<style lang="scss" scoped>
@import '@/assets/css/controller.scss';

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 230px;
    min-height: 400px;
}

.el-menu {
    border-right: none;
}

:deep(.el-sub-menu .el-sub-menu__title) {
    color: black !important;

    &:hover {
        background-color: $hoverMenu  !important;
        color: white !important;
    }
}

:deep(.el-menu-item) {
    border-radius: 8px;
    color: black !important;
}

/* 菜单点中文字的颜色 */
:deep(.el-menu-item.is-active) {
    color: $textColor  !important;
}

/* 当前打开菜单的所有子菜单颜色 */
:deep(.is-opened .el-menu-item) {
    background-color: white !important;
}

/* 鼠标移动菜单的颜色 */
:deep(.el-menu-item:hover) {
    background-color: $textColor  !important;
    color: white !important;
}

@keyframes logoAnimation {
    0% {
        transform: scale(0);
    }

    50% {
        transform: scale(1);
    }

    100% {
        transform: scale(1);
    }
}

.layout-logo {
    animation: logoAnimation 1s ease-out;
}
</style>