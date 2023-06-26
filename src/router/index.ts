import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [

    {
        path: "/",
        component: () => import("@/views/home/three.vue")
    },
    {
        path: '/cubeDemo',
        name: 'cubeDemo',
        component: ()=> import("../views/integratedDemoLists/射线可见/cubeDemo.vue")
    },
    {
        path: '/lightWall',
        name: 'lightWall',
        component: ()=> import("@/views/integratedDemoLists/发光的墙/index.vue")
    },
    {
        path: '/PostEffects',
        name: 'PostEffects',
        component: ()=> import("@/views/integratedDemoLists/后期效果/index.vue")
    },{
        path: '/gmap',
        name: 'gmap',
        component: ()=> import("@/views/integratedDemoLists/高德地图/index.vue")
    },{
        path: '/community',
        name: 'community',
        component: ()=> import("../views/integratedDemoLists/场景练习/sceneDemo.vue")
    },{
        path: '/ggg',
        name: 'ggg',
        component: ()=> import("@/views/Other/面试/事件循环.vue")
    },{
        path: '/curve',
        name: 'curve',
        component: ()=> import("@/views/integratedDemoLists/曲线/index.vue")
    },{
        path: '/splitScene',
        name: 'splitScene',
        component: ()=> import("@/views/integratedDemoLists/模型拆分/index.vue")
    },{
        path: '/modelAnimation',
        name: 'modelAnimation',
        component: ()=> import("@/views/integratedDemoLists/模型动作/index.vue")
    },{
        path: '/effectScene',
        name: 'effectScene',
        component: ()=> import("../views/integratedDemoLists/后期效果/index.vue")
    },{
        path: '/modelAnimation',
        name: 'modelAnimation',
        component: ()=> import("../views/integratedDemoLists/模型动作/index.vue")
    },{
        path: '/modelBg',
        name: 'modelBg',
        component: ()=> import("@/views/integratedDemoLists/模型背景/index.vue")
    },{
        path: '/transFormControl',
        name: 'transFormControl',
        component: ()=> import("@/views/integratedDemoLists/拖拽控制器/index.vue")
    },{
        path: '/flowPath',
        name: 'flowPath',
        component: ()=> import("@/views/integratedDemoLists/流动轨迹/index.vue")
    },{
        path: '/shine',
        name: 'shine',
        component: ()=> import("@/views/integratedDemoLists/后期效果/index.vue")
    },
    {
        path: '/transparent',
        name: 'transparent',
        component: ()=> import("@/views/integratedDemoLists/透明图片材质/index.vue")
    },
    // {
    //     path: '/sb',
    //     name: 'sb',
    //     component: ()=> import("@/views/面试/圣杯布局.vue")
    // },
    {
        path: '/water',
        name: 'water',
        component: ()=> import("@/views/integratedDemoLists/水面/index.vue")
    }, {
        path: '/physics',
        name: 'physics',
        component: ()=> import("@/views/integratedDemoLists/物理/index.vue")
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
        // component: ()=> import("@/views/基本dom/index.vue")
        // component: ()=> import("@/views/map/index.vue")
        component: ()=> import("@/views/Other/面试/vue过渡.vue")
    }
    // ,{
    //     path: '/routerView',
    //     name: 'RouterView',
    //     // component: ()=> import("@/views/面试/变量提升.vue")
    //     // component: ()=> import("@/views/面试/事件循环.vue")
    //     // component: ()=> import("@/views/面试/Symbol.vue")
    //     // component: ()=> import("@/views/面试/this练习.vue")
    //     // component: ()=> import("@/views/面试/原型.vue")
    //     // component: ()=> import("@/views/面试/拖拽.vue")
    //     component: ()=> import("@/views/多个RouterView/index.vue"),
    //     children:[
    //         {
    //             path: '/a',
    //             component: ()=> import("@/views/多个RouterView/childs/a.vue")
    //         },{
    //             path: '/b',
    //             component: ()=> import("@/views/多个RouterView/childs/b.vue")
    //         }
    //     ]
    // }
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