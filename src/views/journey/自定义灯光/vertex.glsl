//logdepthbuf_pars_vertex

varying vec4 vNormal;
varying vec3 vPosition;

bool isPerspectiveMatrix(mat4) {
    return true;
}

void main(){
    vec4 modelPosotion=modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosotion ;
    //logdepthbuf_vertex
    vNormal=modelMatrix * vec4(normal, 0.0);
    vPosition=modelPosotion.xyz;
}