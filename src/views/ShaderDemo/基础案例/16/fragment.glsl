varying vec2 vUv;

void main() {

    //通过长度获取当前坐标相较于原点的长度
    vec2 uv=vUv;
    uv.x+=0.0;
    uv.y+=0.0;

    //length求的是向量的长度，将uv-0.5以后，x和y轴的起始点都是-0.5,结束点都是0.5,中心点都是0，因此才能得到从中心点向周围变暗的图像
    //float color = length(uv-0.5);

    //求当前uv距离中新点的距离，从中间向周围变亮
    //float color = distance(uv,vec2(0.5,0.5));

    //求当前uv距离中新点的距离，从中间向周围变暗
//    float color =1.0 - distance(uv,vec2(0.5,0.5));

    //求当前uv距离中新点的距离，从中间向周围变暗
    float d=distance(uv,vec2(0.5,0.5));
    float color =0.02 / d;

    gl_FragColor = vec4(vec3(color),1);
}
