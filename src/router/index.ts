import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [

    {
        path: '/test',
        name: 'test',
        component: ()=> import("../views/test/cubeDemo.vue")
    },{
        path: '/map',
        name: 'map',
        component: ()=> import("../views/map/index.vue")
    },{
        path: '/community',
        name: 'community',
        component: ()=> import("../views/场景练习/sceneDemo.vue")
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router