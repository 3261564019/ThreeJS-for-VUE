varying vec2 vUv;
varying vec4 vNormal;
varying vec4 vPosition;
uniform float uTime;


float random2D(vec2 st) {
    return fract(sin(dot(st.xy,
    vec2(12.9898,78.233)))*
    43758.5453123);
}

bool isPerspectiveMatrix(mat4) {
    return true;
}



// 双向渐变函数
float dualSmoothStep(float x, float middle, float length) {
    // 计算第一个渐变：从 (middle - length) 到 middle
    float fadeUp = smoothstep(middle - length, middle, x);

    // 计算第二个渐变：从 middle 到 (middle + length)
    float fadeDown = smoothstep(middle, middle + length, x);

    // 混合结果：返回从黑到白再到黑的效果
    return fadeUp - fadeDown;
}

//logdepthbuf_pars_vertex
void main(){
    vec4 modelPosotion=modelMatrix * vec4(position, 1.0);


    //目标高度
    float middle=sin(uTime) * 3.5;


    // 上下指定的距离（控制范围）
    float length = 0.0001;  // 你可以根据需要调整这个值

    float scaleByPosition = dualSmoothStep(modelPosotion.y,middle,0.4);


    float scale=0.7;

    modelPosotion.x+=(random2D(position.xz + uTime)-0.5) * scale * scaleByPosition;
    modelPosotion.z+=(random2D(position.zx + uTime)-0.5) * scale * scaleByPosition;

    gl_Position = projectionMatrix * viewMatrix * modelPosotion ;


    //logdepthbuf_vertex
    vUv=uv;
//    vPosition=vec4(position, 1.0);




    vPosition=modelPosotion;
    vNormal=modelMatrix * vec4(normal, 0.0);
//    vNormal=vec4(normal, 0.0);
    // 顶点着色器中，传递变换后的法向量到片段着色器

}
    