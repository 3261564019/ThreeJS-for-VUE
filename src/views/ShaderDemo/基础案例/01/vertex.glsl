varying vec2 vUv;
uniform sampler2D uTextureOpacity;
void main(){
    vec4 modelPosotion=modelMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * viewMatrix * modelPosotion ;
    vUv=uv;
}
    