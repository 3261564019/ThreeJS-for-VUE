uniform vec3 uColorSide;
uniform vec3 uColorCenter;
uniform vec3 uLightPosition;
uniform float uA;
uniform float uB;
uniform float uOutSidePow;
uniform float uOutSideTransPow;
uniform float uOutSideStep;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

///logdepthbuf_pars_fragment

void main() {
    vec3 normal=normalize(vNormal);
    vec3 sunPosition=uLightPosition;
    vec3 sunDirection=normalize(sunPosition*-1.0);
    float sunOrientation=1.0-max(dot(sunDirection,normal),0.);


//    float lightIntensity=smoothstep(-.25,0.5,sunOrientation);

    //面向灯光的是1，面向背的是0
    float so=max(dot(normal,normalize(sunPosition)),0.);
    float atmosphere=smoothstep(uA,uB,so);
    //混合后的地球边缘颜色
    vec3 a=mix(uColorCenter,uColorSide,atmosphere);

    vec3 cameraDirection=normalize(vPosition-cameraPosition);

    //此时方向相同为-1 垂直为0,相反返回1
    float f=-1.0 * dot(cameraDirection,normal);
    float t=f;
    f=1.-max(0.,f);
    f=pow(f,uOutSidePow);
    //控制球体中间透明0,周边显示的1
    f=1.0-step(f,uOutSideStep);

    //从边缘
    float o=1.-max(0.,t);
    o=pow(o,uOutSideTransPow);

    sunOrientation=pow(sunOrientation,3.8);

    // 使用彩色图像的颜色值，并将黑白图像的亮度值作为透明度
//    gl_FragColor = vec4(vec3(sunOrientation),1.);
//    gl_FragColor = vec4(vec3(o),1.);
    gl_FragColor = vec4(vec3(a),(f-o) * sunOrientation);


//    gl_FragColor = vec4(vec3(atmosphere),1.0);

    ///logdepthbuf_fragment
//    #include <colorspace_fragment>

}
