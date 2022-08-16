//tabs选项卡仓库
import { ITab } from '../type/storeType'
//定义约束state
export type TabsState = {
    //头部选项卡
    tabList: Array<ITab>
}

export const state: TabsState = {
    tabList: []
}

export const mutations = {
    //添加选项卡数据
    setTabList(state: TabsState, tab: ITab) {
        //判断数组中是否存在该tab(登录不会添加至选项卡)
        if (state.tabList.some(item => item.path === tab.path) || tab.path === '/login') return;
        //不存在就添加
        state.tabList.push(tab)
    },
    //替换tabList
    changeTabList(state: TabsState, list: Array<ITab>) {
        state.tabList = list
    }
}

export const getters = {
    //获取选项卡数据数组
    getTabList(state: TabsState) {
        return JSON.parse(JSON.stringify(state.tabList))
    }
}

export const actions = {

}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}