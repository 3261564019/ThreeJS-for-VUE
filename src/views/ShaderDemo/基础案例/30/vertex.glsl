varying vec3 vNormal;
void main(){

    vec4 modelPosotion=modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosotion ;



    vNormal=normal;
}
    