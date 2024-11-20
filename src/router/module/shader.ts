let shaderRoute=[
    {
        path: '/ragingSea',
        name: 'ragingSea',
        component: ()=> import(`@/views/ShaderDemo/ragingSea/index.vue`)
    },{
        path: '/customLight',
        name: 'customLight',
        component: ()=> import(`@/views/journey/自定义灯光/index.vue`)
    },
]

for (let i=1;i<=35;i++){
    let num= (i+'').padStart(2,"0")
    shaderRoute.push(
        {
            path: '/ShaderDemo'+i,
            name: 'ShaderDemo'+i,
            component: ()=> import(`../../views/ShaderDemo/基础案例/${num}/index.vue`)
        }
    )
}

export {shaderRoute}