export let shaderRoute=[
    {
        path: '/ShaderDemo1',
        name: 'ShaderDemo1',
        component: ()=> import("@/views/ShaderDemo/基础案例/01/index.vue")
    },{
        path: '/ShaderDemo2',
        name: 'ShaderDemo2',
        component: ()=> import("@/views/ShaderDemo/基础案例/02/index.vue")
    },{
        path: '/ShaderDemo3',
        name: 'ShaderDemo3',
        component: ()=> import("@/views/ShaderDemo/基础案例/03/index.vue")
    },
]