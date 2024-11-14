varying vec2 vUv;
varying vec4 vPosition;
varying vec4 vNormal;
uniform float uTime;
uniform vec3 uColor;

//logdepthbuf_pars_fragment
void main() {
    //当前点位的世界坐标
    vec3 p=vPosition.rgb;
    //黑白渐变
    float r=mod((p.y - uTime * 0.3) * 8.0,1.0);
    r=pow(r,3.0);

    //相机位置相对于当前点的朝向
    vec3 viewDirection=normalize(p - cameraPosition);

    vec3 normal=normalize(vNormal.rgb);

    //为了使计算结果正确，需要将背面的法向量取反
    if(!gl_FrontFacing){
        normal*=-1.0;
    }


    float fresnel=dot(viewDirection,normal)+1.;
    fresnel=pow(fresnel,2.0);

    r=fresnel * r;

    r+=fresnel * 1.25;

    /**
        fresnel 的值从中间向边缘为0到1的递增
    **/
    float falloff=smoothstep(0.8,0.,fresnel);

    r*=falloff;


    gl_FragColor = vec4(uColor,r);
//    gl_FragColor = vec4(vec3(viewDirection.r),1.0);

    //logdepthbuf_fragment
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
