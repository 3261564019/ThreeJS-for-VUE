varying vec2 vUv;
void main() {

//    float f=step(0.2,distance(vUv,vec2(0.5,0.5)));

    /**
        上面表达式得到的是从当前uv到中心点的距离，因此越靠近中心点距离越小，颜色就越黑
        因此形成从中心到周边的渐变
        将值-0.3，整体会暗下去，中间部分会先变成黑色 0 -3 0
        再计算其绝对值就成   0 3 0 所以形成了中间部分最亮
    **/
    float t=1.0-step(0.02,abs(distance(vUv,vec2(0.5,0.5)) - 0.3));

    float f=abs(distance(vUv,vec2(0.5,0.5)) - 0.3)-t;

    gl_FragColor = vec4(vec3(f),1);
}
