varying vec2 vUv;
uniform sampler2D uTextureOpacity;
void main(){
    vec4 modelPosotion=modelMatrix * vec4(position, 1.0);
    modelPosotion.z+=sin(modelPosotion.x);
    gl_Position = projectionMatrix * viewMatrix * modelPosotion ;
//    gl_Position.x+=1.0;
//    gl_Position.y+=10.0;
//    gl_Position.z+=1.0;
    vUv=uv;
}
    