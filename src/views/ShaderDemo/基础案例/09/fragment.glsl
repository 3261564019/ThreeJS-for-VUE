varying vec2 vUv;
void main() {

    float f=1.0;

    float x=abs(vUv.x-0.5);
    float y=abs(vUv.y-0.5);

//    f=mix(x,y,1.0);
//    f=mix(y+x,x+y,1.0);
//    float opacity=1.0-f;
//    vec3 color=vec3(f);

    /**
        此处的max和Min可以呼唤
    **/
    vec3 color=vec3(max(y,x));

    gl_FragColor = vec4(color,1);
}
