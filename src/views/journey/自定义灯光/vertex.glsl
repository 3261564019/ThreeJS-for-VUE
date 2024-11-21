//logdepthbuf_pars_vertex

bool isPerspectiveMatrix(mat4) {
    return true;
}

void main(){
    vec4 modelPosotion=modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosotion ;
    //logdepthbuf_vertex

}
    