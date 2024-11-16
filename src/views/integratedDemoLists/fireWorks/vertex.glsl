uniform float uSize;
uniform vec2 uResolution;
///logdepthbuf_pars_vertex
bool isPerspectiveMatrix(mat4) {
    return true;
}

void main(){
    vec4 modelPosotion=modelMatrix * vec4(position, 1.0);
    vec4 viewPosition=viewMatrix * modelPosotion;
    gl_Position = projectionMatrix * viewPosition ;

    gl_PointSize=uSize * uResolution.y * 0.01f;
    //近大远小的透视
    gl_PointSize*=1.0 / - viewPosition.z;

    ///logdepthbuf_vertex
}
    