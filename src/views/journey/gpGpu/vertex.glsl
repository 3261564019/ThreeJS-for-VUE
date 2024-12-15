uniform vec2 uResolution;
#include /src/shaders/chunk/PerlinNoise3D.glsl;

void main(){

    vec4 modelPosotion=modelMatrix * vec4(position, 1.0);
    vec4 viewPosition=viewMatrix * modelPosotion;
    gl_Position = projectionMatrix * viewPosition ;

    gl_PointSize=0.2 * uResolution.y * 0.2f;
    gl_PointSize*=1.0 / - viewPosition.z;
}
    