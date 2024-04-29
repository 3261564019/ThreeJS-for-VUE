varying vec2 vUv;


float random (vec2 st) {
    return fract(sin(dot(st.xy,
    vec2(12.9898,78.233)))*
    43758.5453123);
}

void main() {


    /**
        uv.x*10 将其从0-1 转换为 0-10
        并向下取整得到整数位的0-10
        将其*0，1   得到  0 到 1
    **/
    float x=floor(vUv.x*10.0);
    float y=floor(vUv.y*10.0);
//    float y=floor(vUv.y*10.0 * vUv.x + 2.0);

//    新图像
//    vec3 color = vec3(min(x,y));
    vec3 color = vec3(random(vec2(x,y)));
//    vec3 color = vec3(y);

    gl_FragColor = vec4(color,1.0);
}
