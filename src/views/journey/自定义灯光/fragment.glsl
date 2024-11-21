//logdepthbuf_pars_fragment
uniform vec3 uColor;
varying vec4 vNormal;
varying vec3 vPosition;

vec3 ambientLight(vec3 color,float intensity){
    return color * intensity;
}

/**
@param color 光源颜色
@param intensity 光源强度
@param lightPosition 光源位置
@param normal 当前法线向量
@param cameraDirection 摄像机的朝向
**/
vec3 directionLight(
    vec3 color,
    float intensity,
    vec3 lightPosition,
    vec3 normal,
    vec3 cameraDirection
){
    //光照的方向应该和所在位置是相反的
    vec3 lightDirection=normalize(lightPosition*-1.0);
    //点乘得出光照强度，面和光朝向完全相反得到1，夹角大于90度或者相反则为0
    float dv=max(0.,(-1.0*dot(normal,lightDirection)));


    //依据光的方向和法向得到最终反射的方向
    vec3 lightReflect=reflect(lightDirection,normal);
    //点乘得出镜面反射强度，点乘结果大于0，则说明光线与法线夹角小于90度，则反射强度为1，否则为0
    float s=-dot(lightReflect,cameraDirection);
    s=max(0.,s);

    s=pow(s,6.0);

//    return color * intensity*dv;
    return vec3(s);
}

void main() {
    //当前法向
    vec3 normal=normalize(vNormal.rgb);
    vec3 color=uColor;
    //相机朝向当前点减去相机点位
    vec3 cameraDirection=normalize(vPosition-cameraPosition);

    vec3 light=vec3(0.);
    //光的混合是加法
    light+=directionLight(vec3(1.0),0.9,vec3(0.,0.,10.0),normal,cameraDirection);
//    light+=ambientLight(vec3(1.0),0.1);
    //是逐分量操作函数对向量的每个分量单独执行 clamp
//    light=clamp(light, 0.0, 1.0);

    gl_FragColor = vec4(light,1.);
    //gl_FragColor = vec4(vPosition,1.);

    //logdepthbuf_fragment
//    #include <tonemapping_fragment>
//    #include <colorspace_fragment>
}
