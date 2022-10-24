import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [

    {
        path: '/',
        name: 'test',
        component: ()=> import("../views/test/cubeDemo.vue")
    },{
        path: '/map',
        name: 'map',
        component: ()=> import("../views/map/index.vue")
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router