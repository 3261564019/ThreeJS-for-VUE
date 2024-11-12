varying vec2 vUv;
uniform sampler2D uNoiseTexture;
uniform float uTime;


bool isPerspectiveMatrix(mat4) {
    return true;
}

vec2 rotate2D(vec2 v, float a) {
    mat2 m = mat2(cos(a), -sin(a), sin(a), cos(a));
    return m * v;
}

//logdepthbuf_pars_vertex
void main(){

    //从纹理中获取 中线 像素点的颜色
    /**
        通过更新uv的y值，来获取纹理中，当前时间点，对应位置的纹理颜色
        通过scale让uv读取到的uv图像放大，让图像变的平滑
        radiusScale 让旋转的角度更大
    **/
    float scale=0.12;
    float radiusScale=5.0;
    float pointUv=(uv.y - uTime * 0.3)  * scale;
    float img=texture(
        uNoiseTexture,
        vec2(0.5,pointUv)
    ).r;
    vec3 position=vec3(position);
    position.xz=rotate2D(position.xz,img * radiusScale);


    float moveSpeed=0.06;
    //位移的位置只和时间有关系
    float ox=(texture(
                uNoiseTexture,
                vec2(0.1,uTime* moveSpeed )
                ).r - 0.51);

    float oy=(texture(
                uNoiseTexture,
                vec2(0.65,uTime* moveSpeed )
                ).r - 0.5);

    //使用该位移的程度
    //烟雾飘荡的位移(x和z方向)
    vec2 offset=vec2(
        ox,oy
    );
    //幂函数 数值越大，底部越直
    offset*=pow(uv.y,3.0);
    offset*=12.0;

    position.x+=offset.x;
    position.z+=offset.y;

    vec4 modelPosotion=modelMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * viewMatrix * modelPosotion ;

    vUv=uv;

    //logdepthbuf_vertex

}
