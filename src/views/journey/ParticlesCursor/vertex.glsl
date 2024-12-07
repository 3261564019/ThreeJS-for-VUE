uniform vec2 uResolution;
uniform float uSize;
uniform sampler2D uT1;
attribute float uRandomDisplace;
attribute float uAngles;
uniform sampler2D uDisplacement;
varying float intencity;
varying float vRandomDisplace;

void main(){
    //Canvas绘制的笔触
    float moveIntensity=texture2D(uDisplacement,uv).r ;
    //大于0.3会当作1，然而从1到0.3需要点时间，因此是延迟消失的
    moveIntensity=smoothstep(0.1,0.3,moveIntensity);

    vec3 newPosition=position;
    vec3 displace=normalize(vec3(cos(uAngles),sin(uAngles),moveIntensity));

    newPosition+=displace*moveIntensity*(3. *  uRandomDisplace);


    vec4 modelPosotion=modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition=viewMatrix * modelPosotion;
    gl_Position = projectionMatrix * viewPosition;

    float a=texture2D(uT1,uv).r;

    gl_PointSize=uSize * uResolution.y * 0.2f * a;
    gl_PointSize*=1.0 / - viewPosition.z;
    vRandomDisplace=uRandomDisplace;
    intencity=pow(a,1.4);
}