import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/Index.vue'
//静态路由
export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: Layout,
        redirect: '/home',
        children: [
            {
                path: '/home',
                component: () => import('@/views/home/Index.vue'),
                name: 'home',
                meta: {
                    title: '首页',
                }
            },
            {
                path: '/articleList',
                component: () => import('@/views/article/ArticleList.vue'),
                name: 'articleList',
                meta: {
                    title: '文章列表',
                    //使用keep-alive缓存
                    keepAlive: true
                }
            },
            {
                path: '/addArticle',
                component: () => import('@/views/article/AddArticle.vue'),
                name: 'addArticle',
                meta: {
                    title: '写文章',
                    //使用keep-alive缓存
                    keepAlive: true
                }
            },
            {
                path: '/articleComment',
                component: () => import('@/views/comment/ArticleComment.vue'),
                name: 'articleComment',
                meta: {
                    title: '文章评论',
                    //使用keep-alive缓存
                    keepAlive: true

                }
            },
            {
                path: '/leaveMessage',
                component: () => import('@/views/comment/LeaveMessage.vue'),
                name: 'leaveMessage',
                meta: {
                    title: '留言',
                    //使用keep-alive缓存
                    keepAlive: true

                }
            },
            {
                path: '/category',
                component: () => import('@/views/category/Index.vue'),
                name: 'category',
                meta: {
                    title: '分类列表',
                }
            },
            {
                path: '/tag',
                component: () => import('@/views/tag/Index.vue'),
                name: 'tag',
                meta: {
                    title: '标签列表',
                }
            },
            {
                path: '/about',
                component: () => import('@/views/website/About.vue'),
                name: 'about',
                meta: {
                    title: '关于我',
                    //使用keep-alive缓存
                    keepAlive: true
                }
            },
            {
                path: '/message',
                component: () => import('@/views/website/Message.vue'),
                name: 'message',
                meta: {
                    title: '网站信息',
                    //使用keep-alive缓存
                    keepAlive: true
                }
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login/Index.vue'),
        name: 'login',
        meta: {
            title: '登录',
        }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

//路由守卫
//路由白名单
const whiteList = ['/login']

router.beforeEach((to, from, next) => {
    //获取token
    const token = localStorage.getItem('blogToken')
    if (token) {
        //token存在则为登录状态
        //登录状态不能去登录页面
        if (to.path === '/login') {
            next('/')
        } else {
            //编辑文章切换路由前进行提示
            if (to.path != '/articleList' && from.path === '/addArticle' && from.query.editArticleId) {
                ElMessageBox.confirm(
                    '切换页面会导致编辑的文章内容清空，是否还要继续编辑文章?',
                    '提示',
                    {
                        confirmButtonText: '继续编辑文章',
                        cancelButtonText: '我要去其他页面看看',
                        type: 'warning',
                    }
                ).then(() => {
                }).catch(() => {
                    next()
                })
            } else {
                next()
            }
        }
    } else {
        //token不存在则处于未登录状态
        //判断是否存在白名单中
        if (whiteList.indexOf(to.path) !== -1) { //存在白名单中
            next();
        } else { //不存在白名单中,去登录
            if (to.query.editArticleId) {
                next({
                    path: '/login',
                    query: { redirectUrl: to.path, editArticleId: to.query.editArticleId }
                })
            } else {
                next({
                    path: '/login',
                    query: { redirectUrl: to.path, }
                })
            }
        }
    }

})

export default router
