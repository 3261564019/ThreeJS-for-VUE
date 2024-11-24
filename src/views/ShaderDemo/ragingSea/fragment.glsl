#define PI 3.141592653589
//顶点局部坐标系的y值
varying float vheight;
uniform vec3 uHeightColor;
uniform vec3 uDepthColor;
uniform float uMixMultiple;
uniform float uOffset;
varying vec2 vUv;
uniform vec3 uPointLightColor;

varying vec3 vNormal;
varying vec3 vPosition;

#include /src/shaders/light/pointLight.glsl;
#include /src/shaders/light/directionLight.glsl;

void main() {

//    vec3 normal=normalize(vNormal.rgb);

    float mixStrength=(vheight * uMixMultiple) + uOffset;
    mixStrength=smoothstep(0.,1.,mixStrength);


    //相机朝向当前点减去相机点位
    vec3 cameraDirection=normalize(vPosition-cameraPosition);
    vec3 light=vec3(0.);

    light+=pointLight(uPointLightColor,2.,vec3(-10.,3.0,-4.0),vNormal,cameraDirection,28.0,vPosition,0.10,1.);
    light=clamp(light, 0.0, 1.0);


    vec3 color=mix(uDepthColor,uHeightColor,mixStrength);


//    gl_FragColor = vec4(color,1.0);
//    gl_FragColor = vec4(vec3(vPosition.y),1.0);
    gl_FragColor = vec4(vec3(vNormal),1.0);
//    gl_FragColor = vec4(light,1.);
//    gl_FragColor = vec4(light*color,1.);
}
