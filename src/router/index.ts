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
    },{
        path: '/ar',
        name: 'ar',
        component: ()=> import("@/views/AR/index.vue")
    },{
        path: '/closure',
        name: 'closure',
        component: ()=> import("@/views/题目/closure.vue")
    },{
        path: '/sb',
        name: 'sb',
        component: ()=> import("@/views/面试/圣杯布局.vue")
    },{
        path: '/temp',
        name: 'temp',
        // component: ()=> import("@/views/面试/变量提升.vue")
        // component: ()=> import("@/views/面试/事件循环.vue")
        // component: ()=> import("@/views/面试/Symbol.vue")
        // component: ()=> import("@/views/面试/this练习.vue")
        // component: ()=> import("@/views/面试/原型.vue")
        // component: ()=> import("@/views/面试/圣杯布局.vue")
        // component: ()=> import("@/views/流动轨迹/index.vue")
        component: ()=> import("@/views/基本dom/index.vue")
    },{
        path: '/routerView',
        name: 'RouterView',
        // component: ()=> import("@/views/面试/变量提升.vue")
        // component: ()=> import("@/views/面试/事件循环.vue")
        // component: ()=> import("@/views/面试/Symbol.vue")
        // component: ()=> import("@/views/面试/this练习.vue")
        // component: ()=> import("@/views/面试/原型.vue")
        // component: ()=> import("@/views/面试/拖拽.vue")
        component: ()=> import("@/views/多个RouterView/index.vue"),
        children:[
            {
                path: '/a',
                component: ()=> import("@/views/多个RouterView/childs/a.vue")
            },{
                path: '/b',
                component: ()=> import("@/views/多个RouterView/childs/b.vue")
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from)=>{
    console.log("to",to)
    console.log("from",from)
    // return true
})

export default router