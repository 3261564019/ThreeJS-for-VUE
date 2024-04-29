varying vec2 vUv;
void main() {
    vec2 uv=vec2(vUv);
    uv.x-=0.5;
    uv.y-=0.5;
    float angle=abs(atan(uv.x,uv.y) * 0.3);
    gl_FragColor = vec4(vec3(angle),1);
}