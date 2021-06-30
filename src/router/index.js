import Vue from 'vue'
import VueRouter from 'vue-router'

import Top from '@/components/Top.vue'
import View from '@/components/View.vue'
import Edit from '@/components/Edit.vue'
import User from '@/components/User.vue'
import UserSettings from '@/components/User-settings.vue'
import Login from '@/components/Login.vue'
import Signup from '@/components/Signup.vue'
import NotFound from '@/components/NotFound.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Top',
        component: Top,
        meta: {
            title: 'Timedule - 時間割管理ツール',
            desc: '',
        },
    },
    {
        path: '/view/:id',
        name: 'View',
        component: View,
        meta: {
            title: '時間割ビューアー - Timedule',
            desc: '',
        },
    },
    {
        path: '/edit/:id',
        name: 'Edit',
        component: Edit,
        meta: {
            title: '時間割を編集 - Timedule',
            desc: '',
        },
    },
    {
        path: '/user/:user_id',
        name: 'User',
        component: User,
        meta: {
            title: 'ユーザー情報 - Timedule',
            desc: '',
        },
    },
    {
        path: '/user/:user_id/settings',
        name: 'User-settings',
        component: UserSettings,
        meta: {
            title: 'ユーザー設定 - Timedule',
            desc: '',
        },
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            title: 'ログイン - Timedule',
            desc: '',
        },
    },
    {
        path: '/signup',
        name: 'Signup',
        component: Signup,
        meta: {
            title: 'ユーザー登録 - Timedule',
            desc: '',
        },
    },
    {
        path: '*',
        name: 'NotFound',
        component: NotFound,
        meta: {
            title: '404 NotFound - Timedule',
            desc: '',
        },
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

export default router
