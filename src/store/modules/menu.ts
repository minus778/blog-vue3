//menu菜单栏仓库

//定义约束state
export type MenuState = {
    //是否折叠菜单
    collapse: boolean
}

export const state: MenuState = {
    collapse: true,
}

export const mutations = {
    setCollapse(state: MenuState, bol: boolean) {
        state.collapse = bol
    }
}

export const getters = {
    //getters中定义的数据是ref类型的响应式数据，state修改就会触发getters方法，然后在调用了getters的组件中同步修改
    getCol(state: MenuState) {
        return !state.collapse
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