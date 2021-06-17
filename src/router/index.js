import Vue from 'vue'
import VueRouter from 'vue-router'

import Top from '@/components/Top.vue'

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
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

export default router
