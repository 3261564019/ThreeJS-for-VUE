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



#include /src/shaders/light/pointLight.glsl;
#include /src/shaders/light/directionLight.glsl;

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
