#define PI 3.141592653589
//#define PI 3.0
varying vec2 vUv;

/**
**/
vec2 rotate(vec2 uv,float rotation,vec2 mid){
   return vec2(
       cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y)+mid.x,
       cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x)+mid.y
   );
}

void main() {

    vec2 rUv=rotate(vUv,PI/4.0,vec2(0.5,0.5));

    //通过长度获取当前坐标相较于原点的长度
    vec2 uv=rUv;
    vec2 uv1=rUv;

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

    float res=color*color2;



    gl_FragColor = vec4(vec3(res*0.8),1);
}
