void main() {

    vec2 uv=gl_PointCoord;

    float c=distance(uv,vec2(.5));
    c=1.-smoothstep(.3,.55,c);

    gl_FragColor =vec4(vec3(c),c);
}