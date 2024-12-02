uniform vec2 uResolution;
uniform float uSize;
uniform sampler2D uT1;
varying float intencity;

void main(){
    vec4 modelPosotion=modelMatrix * vec4(position, 1.0);
    vec4 viewPosition=viewMatrix * modelPosotion;
    gl_Position = projectionMatrix * viewPosition;

    float a=texture2D(uT1,uv).r;

    gl_PointSize=uSize * uResolution.y * 0.2f *a;
    gl_PointSize*=1.0 / - viewPosition.z;

    intencity=pow(a,1.4);
}