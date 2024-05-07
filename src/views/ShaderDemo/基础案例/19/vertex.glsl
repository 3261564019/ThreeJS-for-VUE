varying vec2 vUv;
void main(){
    vec4 modelPosotion=modelMatrix * vec4(position, 1.0);
//    float height=mod(uv.y * 10.0,1.0);

    float x=abs(uv.x-0.5);
    float y=abs(uv.y-0.5);
//    modelPosotion.z=(x+y)*-30.0;

    gl_Position = projectionMatrix * viewMatrix * modelPosotion ;

    vUv=uv;
}
    