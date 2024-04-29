varying vec2 vUv;

void main() {
    //通过长度获取当前坐标相较于原点的长度
    vec2 uv=vUv;
    vec2 uv1=vUv;

    uv.y*=0.2;
    uv.y+=0.4;

    uv1.x*=0.2;
    uv1.x+=0.4;

    //将uv坐标复制两份，分别在x和y轴进行缩放，

    //求当前uv距离中新点的距离，从中间向周围变暗
    float d=distance(uv,vec2(0.5,0.5));
    float color =0.05 / d;

    float d1=distance(uv1,vec2(0.5,0.5));
    float color2 =0.05 / d1;

    float res=max(color,color2);
//    float res=min(color,color2);
//    float res=color*color2;



    gl_FragColor = vec4(vec3(res*0.1),1);
}
