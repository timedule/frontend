import Vue from 'vue'
import VueRouter from 'vue-router'

import Top from '@/components/Top.vue'
import View from '@/components/View.vue'
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
