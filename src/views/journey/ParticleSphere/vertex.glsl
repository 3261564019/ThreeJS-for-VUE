uniform vec2 uResolution;
attribute vec3 aTargetPosition;
uniform float uRage;
void main(){

    vec3 newPosition=mix(position,aTargetPosition,uRage);

    vec4 modelPosotion=modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition=viewMatrix * modelPosotion;
    gl_Position = projectionMatrix * viewPosition ;


    gl_PointSize=0.1 * uResolution.y * 0.2f;
    gl_PointSize*=1.0 / - viewPosition.z;
}
    