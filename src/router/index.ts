import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [

    {
        path: '/test',
        name: 'test',
        component: ()=> import("../views/test/cubeDemo.vue")
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router