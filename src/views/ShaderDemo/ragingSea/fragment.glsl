#define PI 3.141592653589
//顶点局部坐标系的y值
varying float vheight;
uniform vec3 uHeightColor;
uniform vec3 uDepthColor;
uniform float uMixMultiple;
uniform float uSpecular;
uniform float uOffset;
uniform float uPointLightStrength;
uniform float uDirectionLightStrength;
varying vec2 vUv;
uniform vec3 uPointLightColor;
uniform vec3 uDirectionLightColor;
varying float vMaxHeight;

varying vec3 vNormal;
varying vec3 vPosition;

#include /src/shaders/light/pointLight.glsl;
#include /src/shaders/light/directionLight.glsl;
#include /src/shaders/light/ambientLight.glsl;
#include /src/shaders/chunk/remap.glsl;


void main() {


    float mixStrength=(vheight * uMixMultiple) + uOffset;
    mixStrength=smoothstep(0.,1.,mixStrength);


    //相机朝向当前点减去相机点位
    vec3 cameraDirection=normalize(vPosition-cameraPosition);
    vec3 light=vec3(0.);
//    light+=ambientLight(vec3(1.),0.1);
    light+=pointLight(uPointLightColor,uPointLightStrength,vec3(-8.,6.0,3.),vNormal,cameraDirection,28.0,vPosition,uSpecular,2.);
    light+=pointLight(uPointLightColor,uPointLightStrength,vec3(8.,6.0,-8.),vNormal,cameraDirection,28.0,vPosition,uSpecular,2.);
    light+=directionLight(uDirectionLightColor,uDirectionLightStrength,vec3(0.,10.,0.0),vNormal,cameraDirection,0.7);

    light=clamp(light, 0.0, 1.0);

    //大致计算最高点和最低点进行remap
    float t=remap(vPosition.y,-vMaxHeight-0.9,vMaxHeight,0.,1.) ;

    vec3 color=mix(uDepthColor,uHeightColor,t);
//    color=vec3(1.0);

//    gl_FragColor = vec4(color,1.0);
//    gl_FragColor = vec4(vec3(vPosition.y),1.0);
//    gl_FragColor = vec4(vec3(vNormal),1.0);
//    gl_FragColor = vec4(light,1.);
    gl_FragColor = vec4(light*color,1.);
//    gl_FragColor = vec4(vec3(t),1.);
}
