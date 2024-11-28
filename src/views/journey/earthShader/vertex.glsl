varying vec2 vUv;
varying vec3 vNormal;
///logdepthbuf_pars_vertex


bool isPerspectiveMatrix(mat4) {
    return true;
}

void main(){
    vec4 modelPosotion=modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosotion ;

    vNormal=(modelMatrix * vec4(normal, 0.0)).xyz;
    vUv=uv;

    ///logdepthbuf_vertex
}
    