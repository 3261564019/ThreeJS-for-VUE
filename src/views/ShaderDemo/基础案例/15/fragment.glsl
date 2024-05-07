varying vec2 vUv;

void main() {

    //通过长度获取当前坐标相较于原点的长度
    vec3 color = vec3(length(vUv));

    gl_FragColor = vec4(color,1.0);
}
