//user用户仓库
import { ActionContext } from "vuex";
import { RootState } from "../index";
import { loginType } from "@/network/api/user/UserModel";
import { Result } from "@/network/request";
import { login, changeWebsite } from "@/network/api/user/user";
import { BlogMes } from '@/store/type/storeType'
//定义约束state
export type UserState = {
    //token
    token: string,
    blogMes: BlogMes
}

export const state: UserState = {
    token: localStorage.getItem('blogToken') || '',
    blogMes: JSON.parse(localStorage.getItem('blogMes') as any) || {}
}

export const mutations = {
    //保存token
    setToken(state: UserState, token: string) {
        state.token = token
    },
    //保存网站信息
    setUserMes(state: UserState, item: BlogMes) {
        state.blogMes = item
    }
}

export const getters = {
    //获取用户头像url
    getAvatar(state: UserState) {
        return state.blogMes.websiteAddress + state.blogMes.avatar
    },
    //获取用户名称
    getName(state: UserState) {
        return state.blogMes.name
    },
    //获取网站信息
    getBlogMes(state: UserState) {
        return JSON.parse(JSON.stringify(state.blogMes))
    },
    //获取后端url
    getWebsiteUrl(state: UserState) {
        return state.blogMes.websiteAddress
    }
}

export const actions = {
    //登录获取token并保存
    loginBlog({ commit }: ActionContext<UserState, RootState>, loginParam: loginType) {
        //返回一个promise供外界调用（请求返回值类型为提前定义的Result类型）
        return new Promise<Result>((resolve, reject) => {
            login(loginParam).then(res => {
                console.log('登录返回的数据：', res);
                //登录成功
                if (res.code === 200) {
                    //保存token至仓库
                    commit('setToken', res.data.token)
                    //保存用户信息至仓库
                    commit('setUserMes', res.data.mes)
                    //将token保存至localStorage
                    localStorage.setItem('blogToken', res.data.token)
                    //将网站信息保存至localStorage
                    localStorage.setItem('blogMes', JSON.stringify(res.data.mes))
                }
                //将登录返回数据返回出去
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    //修改网站信息
    changeWebsiteMes({ commit }: ActionContext<UserState, RootState>, data: BlogMes) {
        //返回一个promise供外界调用（请求返回值类型为提前定义的Result类型）
        return new Promise<Result>((resolve, reject) => {
            changeWebsite(data).then(res => {
                console.log('成功修改网站信息');
                //登录成功
                if (res.code === 200) {
                    //保存修改后的网站信息至仓库
                    commit('setUserMes', data)
                    //将修改后的网站信息保存至localStorage
                    localStorage.setItem('blogMes', JSON.stringify(data))
                }
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}