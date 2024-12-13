import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
import {shaderRoute} from "@/router/module/shader";

const routes: Array<RouteRecordRaw> = [

    {
        path: "/",
        component: () => import("@/views/home/three.vue")
    },
    {
        path: "/main",
        component: () => import("@/views/integratedDemoLists/遮挡dom/index.vue")
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
        path: '/gmapt',
        name: 'gmapt',
        component: ()=> import("@/views/integratedDemoLists/高德地图/temp.vue")
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
    }, {
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
    {
        path: '/shaderPart',
        name: 'shaderPart',
        component: ()=> import("@/views/unsuccessful/shaderPart/index.vue")
    },
    {
        path: '/ammo',
        name: 'ammo',
        component: ()=> import("@/views/unsuccessful/AmmoJS/index.vue")
    },
    {
        path: '/surroundCompute',
        name: 'surroundCompute',
        component: ()=> import("@/views/integratedDemoLists/surroundComputing/index.vue")
    },
    {
        path: '/water',
        name: 'water',
        component: ()=> import("@/views/integratedDemoLists/水面/index.vue")
    }, {
        path: '/enable3d',
        name: 'enable3d',
        component: ()=> import("@/views/enable3d/index.vue")
    }, {
        path: '/physics',
        name: 'physics',
        component: ()=> import("@/views/integratedDemoLists/物理/index.vue")
    }, {
        path: '/webVR',
        name: 'webVR',
        component: ()=> import("@/views/integratedDemoLists/webVR/index.vue")
    },{
        path: '/characterControls',
        name: 'characterControls',
        component: ()=> import("@/views/integratedDemoLists/第三人称移动自/index.vue")
    },{
        path: '/grass',
        name: 'grass',
        component: ()=> import("@/views/integratedDemoLists/草地/index.vue")
    },{
        path: '/test',
        name: 'test',
        component: ()=> import("@/views/integratedDemoLists/mapPath/index.vue")
    },{
        path: '/ttt',
        component: ()=> import("@/views/Other/面试/test.vue")
    },{
        path: '/sphereLerp',
        component: ()=> import("@/views/integratedDemoLists/球型lerp/index.vue")
    },{
        path: '/materialExpand',
        component: ()=> import("@/views/integratedDemoLists/拓展基础材质/index.vue"),

    },{
        path: '/coffeeSmoke',
        component: ()=> import("@/views/integratedDemoLists/咖啡烟雾/index.vue"),
    },{
        path: '/modelCurve',
        component: ()=> import("@/views/unsuccessful/modelCurve/index.vue"),
    },{
        path: '/hologram',
        component: ()=> import("@/views/integratedDemoLists/全息显示/index.vue"),
    },{
        path: '/fireWorks',
        component: ()=> import("@/views/integratedDemoLists/fireWorks/index.vue"),
    },{
        path: '/earthShader',
        component: ()=> import("@/views/journey/earthShader/index.vue"),
    },{
        path: '/particlesCursor',
        component: ()=> import("@/views/journey/ParticlesCursor/index.vue"),
    },{
        path: '/particleSphere',
        component: ()=> import("@/views/journey/ParticleSphere/index.vue"),
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
        // component: ()=> import("@/views/Other/面试/vue过渡.vue")
        // component: ()=> import("@/views/integratedDemoLists/倾斜投影/index.vue")
        // component: ()=> import("@/views/integratedDemoLists/渲染模型/index.vue")
        // component: ()=> import("@/views/ShaderDemo/基础案例/03/index.vue")
        // component: ()=> import("@/views/unsuccessful/cannon调试/index.vue")
        // component: ()=> import("@/views/integratedDemoLists/多个RouterView/index.vue"),
        // component: ()=> import("@/views/integratedDemoLists/bvh/index.vue")
        // component: ()=> import("@/views/Other/面试/flex.vue"),
        component: ()=> import("@/views/integratedDemoLists/拓展基础材质/index.vue"),
        // component: ()=> import("@/views/integratedDemoLists/场景练习/sceneDemo.vue"),
        // component: ()=> import("@/views/enable3d/index.vue")
        // component: ()=> import("@/views/integratedDemoLists/第三人称enable3D/index.vue")
        // component: ()=> import("@/views/unsuccessful/shaderPart/index.vue")
        // component: ()=> import("@/views/integratedDemoLists/第三人称移动自/index.vue")
        // component: ()=> import("@/views/integratedDemoLists/第三人称enable3D/index.vue")
        // component: ()=> import("@/views/integratedDemoLists/第三人称/index.vue")
        children:[
                {
                    path: '/a',
                    component: ()=> import("@/views/integratedDemoLists/多个RouterView/childs/a.vue")
                },{
                    path: '/b',
                    component: ()=> import("@/views/integratedDemoLists/多个RouterView/childs/b.vue")
                }
                ]
    },{
        path: '/webVR',
        name: 'webVR',
        component: ()=> import("@/views/integratedDemoLists/webVR/index.vue")
    },{
        path: '/SketchBoxControl',
        name: 'SketchBoxControl',
        component: ()=> import("@/views/integratedDemoLists/SketchBoxControl/index.vue")
    },{
        path: '/Coordinate',
        name: 'Coordinate',
        component: ()=> import("@/views/unsuccessful/坐标系/index.vue")
    },{
        path: '/Cover',
        name: 'Cover',
        component: ()=> import("@/views/integratedDemoLists/遮挡dom/index.vue")
    },{
        path: '/foldline',
        name: 'foldline',
        component: ()=> import("@/views/integratedDemoLists/foldline/index.vue")
    },{
        path: '/expandBasic',
        name: 'expandBasic',
        component: ()=> import("@/views/integratedDemoLists/拓展基础材质/index.vue")
    },
    ...shaderRoute
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
