uniform vec2 uResolution;
uniform sampler2D uParticlesTexture;
attribute vec2 aParticlesUv;
#include /src/shaders/chunk/PerlinNoise3D.glsl;

void main(){

    vec4 particles=texture(uParticlesTexture,aParticlesUv);
    vec4 modelPosotion=modelMatrix * vec4(vec3(particles.xyz), 1.0);
    vec4 viewPosition=viewMatrix * modelPosotion;
    gl_Position = projectionMatrix * viewPosition ;

    gl_PointSize=0.5 * uResolution.y * 0.2f;
    gl_PointSize*=1.0 / - viewPosition.z;
}
    