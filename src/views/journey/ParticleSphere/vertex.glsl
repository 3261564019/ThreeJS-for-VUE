uniform vec2 uResolution;
attribute vec3 aTargetPosition;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uRage;
varying float vNoise;
varying vec3 vColor;

#include /src/shaders/chunk/PerlinNoise3D.glsl;

void main(){
    /**


    **/

    vNoise=PerlinNoise3D(position*3.)-0.2;

    vNoise=abs(vNoise);

    vNoise=smoothstep(0.,1.,vNoise);
    float p=0.6;
    float start=vNoise*p;
    float end=start+1.0-p;
    float rage=smoothstep(start,end,uRage);
    vColor=mix(uColorA,uColorB,vNoise);

    vec3 newPosition=mix(position,aTargetPosition,rage);

    vec4 modelPosotion=modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition=viewMatrix * modelPosotion;
    gl_Position = projectionMatrix * viewPosition ;

    gl_PointSize=0.2 * uResolution.y * 0.2f;
    gl_PointSize*=1.0 / - viewPosition.z;
}
    