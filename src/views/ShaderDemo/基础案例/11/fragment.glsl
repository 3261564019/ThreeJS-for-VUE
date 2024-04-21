varying vec2 vUv;


bool inRange(float value, float min, float max) {
    return value >= min && value <= max;
}

void main() {


    //方案1
    float x=vUv.x;
    float y=vUv.y;
    /**
        uv.x*10 将其从0-1 转换为 0-10
        并向下取整得到整数位的0-10
        将其*0，1   得到  0 到 1
    **/
    float f=floor(vUv.x*10.0)*0.1;

    vec3 color = vec3(f);

    gl_FragColor = vec4(color,1.0);
}
