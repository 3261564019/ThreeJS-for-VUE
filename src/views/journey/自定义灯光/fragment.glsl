//logdepthbuf_pars_fragment
uniform vec3 uColor;
uniform vec3 uPointLightColor;
uniform vec3 uPointLightColor1;
uniform vec3 uPlaneLightColor;

uniform float uSpecular;
uniform float uSpecularMode;
uniform float uPlaneLightStrength;
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
@param specular 高光程度
**/
vec3 directionLight(
    vec3 color,
    float intensity,
    vec3 lightPosition,
    vec3 normal,
    vec3 cameraDirection,
    float specular
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

    s=pow(s,specular);

    /*
        可以直接将高光结果和灯光运算结果相加
        base+vec3(s)
        高光部分将会是白色

        base+vec3(s)*color*intensity
        高光部分将是灯光的颜色
    */

    vec3 base=color * intensity * dv;

    return  base+vec3(s)*color*intensity;
}


/**
@param color 光源颜色
@param intensity 光源强度
@param lightPosition 光源位置
@param normal 当前法线向量
@param cameraDirection 摄像机的朝向
@param position 片元坐标
@param pdecay 光线衰减程度，越大衰减越厉害
**/
vec3 pointLight(
    vec3 color,
    float intensity,
    vec3 lightPosition,
    vec3 normal,
    vec3 cameraDirection,
    float specular,
    vec3 position,
    float pdecay,
    float uSpecularMode
){
    //光源位置减去当前位置
    vec3 positionDelta=position-lightPosition;
    //光源位置的当前位置的间距
    float lightDistance=length(positionDelta);
    //衰减程度最小为0
    float decay=max(0.,1.- lightDistance * pdecay);
    //光照的方向应该和所在位置是相反的
    vec3 lightDirection=normalize(positionDelta);
    //点乘得出光照强度，面和光朝向完全相反得到1，夹角大于90度或者相反则为0
    float dv=max(0.,(-1.0*dot(normal,lightDirection)));


    //依据光的方向和法向得到最终反射的方向
    vec3 lightReflect=reflect(lightDirection,normal);
    //点乘得出镜面反射强度，点乘结果大于0，则说明光线与法线夹角小于90度，则反射强度为1，否则为0
    float s=-dot(lightReflect,cameraDirection);
    s=max(0.,s);

    s=pow(s,specular);

    /*
        模式1
        可以直接将高光结果和灯光运算结果相加
        base+vec3(s)
        高光部分将会是白色

        模式2
        base+vec3(s)*color*intensity
        高光部分将是灯光的颜色
    */

    vec3 base=color * intensity * dv;

    if(uSpecularMode==2.0){
        return  (base+vec3(s)*color*intensity) * decay;
    }

    if(uSpecularMode==1.0){
        return  base+vec3(s)*color*intensity + decay;
    }
    return vec3(0);
}

void main() {
    //当前法向
    vec3 normal=normalize(vNormal.rgb);
    vec3 color=uColor;
    //相机朝向当前点减去相机点位
    vec3 cameraDirection=normalize(vPosition-cameraPosition);

    vec3 light=vec3(0.);
    //光的混合是加法
    light+=directionLight(uPlaneLightColor,uPlaneLightStrength,vec3(0.,0.,10.0),normal,cameraDirection,uSpecular);
    light+=ambientLight(vec3(1.0),0.1);
    light+=pointLight(uPointLightColor,uPlaneLightStrength,vec3(-5.,2.0,-4.0),normal,cameraDirection,uSpecular,vPosition,0.10,uSpecularMode);
    light+=pointLight(uPointLightColor1,uPlaneLightStrength,vec3(5.,2.0,-4.0),normal,cameraDirection,uSpecular,vPosition,0.10,uSpecularMode);
    //是逐分量操作函数对向量的每个分量单独执行 clamp
    light=clamp(light, 0.0, 1.0);

    gl_FragColor = vec4(light*color,1.);

    //logdepthbuf_fragment
    //#include <tonemapping_fragment>
    //#include <colorspace_fragment>
}
