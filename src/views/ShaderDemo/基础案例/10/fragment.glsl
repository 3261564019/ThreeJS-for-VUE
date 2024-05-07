varying vec2 vUv;


bool inRange(float value, float min, float max) {
    return value >= min && value <= max;
}

void main() {

    float f=1.0;

    //方案1
//    float x=vUv.x;
//    float y=vUv.y;
//    vec3 color = vec3(inRange(x, 0.35, 0.65) && inRange(y, 0.35, 0.65) ? 0.0 : 1.0);


    //方案2
    float x=abs(vUv.x-0.5);
    float y=abs(vUv.y-0.5);
    vec3 color = vec3(step(0.2,x)+step(0.2,y));


    gl_FragColor = vec4(color,1.0);
}
