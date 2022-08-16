import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import menu, { MenuState } from './modules/menu'
import tabs, { TabsState } from './modules/tabs'
import user, { UserState } from './modules/user'
import tags, { TagsState } from './modules/tags'
import categories, { CategoriesState } from './modules/categories'
import articles, { ArticlesState } from './modules/articles'
import comments, { CommentsState } from './modules/comments'
import { CommonStore } from './help'

// 为 store state 声明类型
export interface RootState {
    //定义根state的类型，将每个模块的state类型定义在这里
    menu: MenuState
    tabs: TabsState,
    user: UserState,
    tags: TagsState,
    categories: CategoriesState,
    articles: ArticlesState,
    comments: CommentsState
}

// 定义 injection key
export const key: InjectionKey<Store<RootState>> = Symbol()

export const modules = {
    menu: menu,
    tabs: tabs,
    user: user,
    tags: tags,
    categories: categories,
    articles: articles,
    comments: comments
}

//通过 as CommonStore使用我们自己实现的mutations/getters/actions
export const store = createStore<RootState>({
    //使用模块化
    modules
}) as CommonStore

// 定义自己的 `useStore` 组合式函数(简化了在组件中引入key的步骤--函数柯里化)
export function useStore() {
    return baseUseStore(key) as CommonStore
}