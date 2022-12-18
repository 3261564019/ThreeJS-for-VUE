import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [

    {
        path: "/",
        component: () => import("@/views/home/three.vue")
    },
    {
        path: '/test',
        name: 'test',
        component: ()=> import("../views/test/cubeDemo.vue")
        // component: ()=> import("../views/test/calc.vue")
    },{
        path: '/map',
        name: 'map',
        component: ()=> import("../views/map/index.vue")
    },{
        path: '/community',
        name: 'community',
        component: ()=> import("../views/场景练习/sceneDemo.vue")
    },{
        path: '/ammoDemo1',
        name: 'ammoDemo1',
        component: ()=> import("../views/AmmoJS/index.vue")
    },{
        path: '/splitScene',
        name: 'splitScene',
        component: ()=> import("../views/模型拆分/index.vue")
    },{
        path: '/effectScene',
        name: 'effectScene',
        component: ()=> import("../views/后期效果/index.vue")
    },{
        path: '/modelAnimation',
        name: 'modelAnimation',
        component: ()=> import("../views/模型动作/index.vue")
    },{
        path: '/modelBg',
        name: 'modelBg',
        component: ()=> import("@/views/模型背景/index.vue")
    },{
        path: '/curve',
        name: 'curve',
        component: ()=> import("@/views/曲线/index.vue")
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router