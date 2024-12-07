varying float intencity;
varying float vRandomDisplace;

void main() {

    vec2 uv=gl_PointCoord;

    float c=distance(uv,vec2(.5));
    c=1.-smoothstep(.3,.55,c);

    //intencity是根据大小算出来的透明度
    c*=intencity;

    gl_FragColor =vec4(vec3(c),c);
}