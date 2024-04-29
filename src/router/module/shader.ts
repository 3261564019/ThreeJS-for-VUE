let shaderRoute=[]

for (let i=1;i<=22;i++){
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