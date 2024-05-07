#define PI 3.141592653589
varying vec2 vUv;
void main() {
    vec2 uv=vec2(vUv);
    uv.x-=0.5;
    uv.y-=0.5;
    /**

    **/
    float angle=atan(uv.x,uv.y);
    angle/=PI * 2.0;
    angle+=0.5;

//    angle=step(angle,0.);
    gl_FragColor = vec4(vec3(angle),1);
}