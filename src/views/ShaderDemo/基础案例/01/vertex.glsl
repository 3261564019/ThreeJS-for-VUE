varying vec2 vUv;
varying vec3 vPosition;
void main(){

    gl_Position =vec4(position, 1.0);
    vUv=uv;
    vPosition=position;
}
    