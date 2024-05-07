#define PI 3.141592653589
varying vec2 vUv;
varying float vTime;
uniform float uTime;
void main() {
    vec2 uv=vec2(vUv);
    uv.x-=0.5;
    uv.y-=0.5;

    float dis=distance(vec2(0.0,0.0),uv);

    float angle=atan(uv.x,uv.y);

    dis-=sin(angle*20.0)*0.01;

    float color=step(distance(dis,0.25),0.004);

    gl_FragColor = vec4(vec3(color),1);
}