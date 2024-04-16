varying vec2 vUv;
varying vec4 VModelPosition;
varying float VPointRandom;
uniform sampler2D uTextureOpacity;
uniform float uTime;
attribute float APointRandom;
void main(){
    vec4 modelPosotion=modelMatrix * vec4(position, 1.0);
//    modelPosotion.z+=sin(modelPosotion.x);
    modelPosotion.z+=sin(uTime*APointRandom);
//    modelPosotion.z+=uTime;
    gl_Position = projectionMatrix * viewMatrix * modelPosotion ;
//    gl_Position.x+=1.0;
//    gl_Position.y+=10.0;
//    gl_Position.z+=1.0;
    VModelPosition=modelPosotion;
    VPointRandom=APointRandom;
    vUv=uv;
}
    