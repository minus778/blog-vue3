<template>
    <el-tabs v-model="activeTab" type="card" @tab-click="tabClick" closable @tab-remove="removeTab">
        <el-tab-pane v-for="item in tabsList" :key="item.path" :label="item.title" :name="item.path"></el-tab-pane>
    </el-tabs>
</template>

<script setup lang='ts'>
import { useStore } from '@/store'
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, watch, onMounted } from 'vue'
import { ITab } from '@/store/type/storeType'

const store = useStore()
const router = useRouter()
const route = useRoute()

//tabList选项卡数组
let tabsList = computed(() => {
    return store.getters['tabs/getTabList']
})

//当前选中tab
const activeTab = ref('')

//设置当前选中的tab
const setCurrentTab = () => {
    activeTab.value = route.path
}

//添加选项卡
const addTab = () => {
    const { path, meta } = route;
    const tab: ITab = {
        title: meta.title as string,
        path: path === '/' ? '/home' : path
    }
    store.commit('tabs/setTabList', tab);
}

//点击切换跳转路由
const tabClick = (tab: any) => {
    const { props } = tab;
    router.push({ path: props.name })
}
//删除tab选项卡
const removeTab = (targetName: any) => {
    //不能删除首页选项卡
    if (targetName === '/home') return;
    const tabs = tabsList.value;
    let activeName = activeTab.value;
    //删除的是当前选中的选项卡
    if (activeName === targetName) {
        tabs.forEach((tab: ITab, index: number) => {
            if (tab.path === targetName) {
                //选中后移或前移
                const nextTab = tabs[index + 1] || tabs[index - 1]
                console.log(nextTab)
                if (nextTab) {
                    activeName = nextTab.path
                }
            }
        })
    }
    //删除的不是当前选中的选项卡
    activeTab.value = activeName
    //更新仓库tabList
    store.commit('tabs/changeTabList', tabs.filter((tab: ITab) => tab.path !== targetName))
    //不管是否移动了选项卡都跳转路由
    router.push({ path: activeName })
}

//将tabList存储在sessionStorage中解决刷新问题
const saveTabList = () => {
    //解决刷新数据丢失的问题,不是登录请求的时候，才缓存tabsView，避免将登录路由存储到localstorage
    if (route.path != '/login') {
        //监听浏览器刷新（刷新之前将仓库中的选项卡数组存储到sessionStorage中）
        window.addEventListener("beforeunload", () => {
            //存储到sessionStorage中
            sessionStorage.setItem("tabViews", JSON.stringify(tabsList.value));
        })
        let tabSession = sessionStorage.getItem("tabViews");
        if (tabSession) {
            let oldViews = JSON.parse(tabSession);
            //刷新后获取的tabList有值就存储到仓库中（赋值）
            if (oldViews.length > 0) {
                store.commit('tabs/changeTabList', oldViews)
            }
        }
    }
}

onMounted(() => {
    //页面挂载就执行添加当前route的tab
    addTab()
    //页面挂载更新当前选中tab
    setCurrentTab()
    //页面挂载更新sessionStorage
    saveTabList()
})
//监听路由变化添加对应tab
watch(() => route.path, () => {
    //路由刷新就添加对应的tab
    addTab()
    //路由刷新更新当前选中tab
    setCurrentTab()
})

</script>

<style scoped lang='scss'>
@import '@/assets/css/controller.scss';

:deep(.el-tabs__nav-prev),
:deep(.el-tabs__nav-next) {
    line-height: 26px;
}

.el-tabs {
    --el-tabs-header-height: 26px
}

:deep(.el-tabs__header) {
    margin: 0px;
    height: 26px;
    border-top: 1px solid #e4e7ed;
}

:deep(.el-tabs__item) {
    position: relative;
    height: 26px !important;
    line-height: 26px !important;
    text-align: center !important;
    margin: 0px 3px !important;
    color: #495060;
    font-size: 12px !important;
    padding: 0xp 10px !important;
    top: -1px;
}

:deep(.el-tabs__nav) {
    border: none !important;
}

:deep(.is-active) {
    border-bottom: 1px solid transparent !important;
    background-color: $textColor  !important;
    color: #fff !important;
}

:deep(.el-tabs__item:hover) {
    color: #495060 !important;
}

:deep(.is-active:hover) {
    color: #fff !important;
}
</style>


