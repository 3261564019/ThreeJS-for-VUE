varying vec2 vUv;


// 双向渐变函数
float dualSmoothStep(float x, float middle, float length) {
    // 计算第一个渐变：从 (middle - length) 到 middle
    float fadeUp = smoothstep(middle - length, middle, x);

    // 计算第二个渐变：从 middle 到 (middle + length)
    float fadeDown = smoothstep(middle, middle + length, x);

    //return fadeUp;
    //0.5 - 0.6   是 1 到 0  由白变黑

    //return fadeDown;
    // 0.4 - 0.5   是 1 到 0 由白变黑
    return fadeUp - fadeDown;
}


void main() {

    float f=dualSmoothStep(vUv.y,0.5,0.1);

    f=smoothstep(-0.5,0.5,vUv.y);

    gl_FragColor = vec4(vec3(f),1);
}
