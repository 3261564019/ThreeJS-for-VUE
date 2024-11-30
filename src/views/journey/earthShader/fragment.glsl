varying vec2 vUv;
varying vec3 vNormal;

uniform sampler2D uDay;
uniform sampler2D uNight;
uniform sampler2D uClouds;
uniform sampler2D uSpecular;
varying vec3 vPosition;

uniform vec3 uLightPosition;
uniform vec3 uColorSide;
uniform vec3 uColorCenter;

uniform float uTime;
uniform float uA;
uniform float uColorPow;
uniform float uB;
uniform float uC;
uniform float uSpecularPow;

#include /src/shaders/chunk/remap.glsl;

uniform float uCloudSize;
///logdepthbuf_pars_fragment

void main() {
    vec3 normal=normalize(vNormal);
    vec3 Day=texture2D(uDay,vUv).rgb;
    vec3 Night=texture2D(uNight,vUv).rgb;
    vec2 cUv=vUv;
    vec3 Clouds=texture2D(uClouds,cUv).rgb;
    vec3 Specular=texture2D(uSpecular,vUv).rgb;

    //相机的朝向
    vec3 cameraDirection=normalize(vPosition-cameraPosition);
    //光源位置
    vec3 sunPosition=uLightPosition;
    vec3 sunDirection=normalize(sunPosition*-1.0);

    //相机位置相对于当前点的朝向
    vec3 viewDirection=normalize(vPosition - cameraPosition);

    //夜间灯光的混合程度,背对灯光的是1面对灯光的是0
    float sunOrientation=max(dot(sunDirection,normal),0.);
    float lightIntensity=smoothstep(-.25,0.5,sunOrientation);

    vec3 color;

    //混合日光颜色和夜晚的灯光颜色
    color=mix(Day,Night,lightIntensity);
    //混合云的白色的程度，将透明度高的完全透明
    float cloudsMix=smoothstep(uCloudSize,1.0,Clouds.r);
    //夜晚云的强度和夜晚灯光的强度是相反的
    //使用max是让夜间也显示一点云
    float p=max(0.01,1.0-(lightIntensity));
    cloudsMix = cloudsMix * p;
    color=mix(color,vec3(1.),cloudsMix);


    //面向灯光的是1，面向背的是0
    float so=max(dot(normal,normalize(sunPosition)),0.);
    float atmosphere=smoothstep(uA,uB,so);
    //混合后的地球边缘颜色
    vec3 a=mix(uColorCenter,uColorSide,atmosphere);
    //该值为中间和背向灯光的面为0，面向灯光的边缘为1
    float fresnel=dot(viewDirection,normal)+1.;
    fresnel=pow(fresnel,uColorPow);
    fresnel*=1.0-lightIntensity;
    color=mix(color,a,fresnel);


    //依据光的方向和法向得到最终反射的方向
    vec3 lightReflect=reflect(sunDirection,normal);
    //点乘得出镜面反射强度，点乘结果大于0，则说明光线与法线夹角小于90度，则反射强度为1，否则为0
    float s=-dot(lightReflect,cameraDirection);
    s=max(0.,s);
    //此处s是高光程度
    s=pow(s,uSpecularPow);
    //高光程度混合糙度贴图
    float e=Specular.r*s;
    //白色和蓝红渐变混合
    vec3 specularColor=mix(vec3(1.),a,fresnel);
    //在面向灯光的地方会偏蓝色
    color+=specularColor*e;

    gl_FragColor = vec4(vec3(color),1.);
//    gl_FragColor = vec4(vec3(fresnel),1.);

    ///logdepthbuf_fragment
//    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
