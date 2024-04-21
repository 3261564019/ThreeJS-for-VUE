varying vec2 vUv;


bool inRange(float value, float min, float max) {
    return value >= min && value <= max;
}

void main() {


    /**
        uv.x*10 将其从0-1 转换为 0-10
        并向下取整得到整数位的0-10
        将其*0，1   得到  0 到 1
    **/
    float x=floor(vUv.x*10.0)*0.1;
    float y=floor(vUv.y*10.0)*0.1;

//    新图像
//    vec3 color = vec3(min(x,y));
    vec3 color = vec3(mix(x,y,0.5));
//    vec3 color = vec3(y);

    gl_FragColor = vec4(color,1.0);
}
