varying vec2 vUv;
void main() {

    float f=1.0;
    float x=vUv.x-0.5;
    f=abs(x);

    vec3 color=vec3(f);

    gl_FragColor = vec4(color,1.0);
}
