varying vec2 vUv;
varying vec3 vNormal;

uniform sampler2D uDay;
uniform sampler2D uNight;
uniform sampler2D uClouds;
uniform sampler2D uSpecular;

uniform vec3 uLightPosition;
uniform vec3 uColorSide;
uniform vec3 uColorCenter;


uniform float uCloudSize;
///logdepthbuf_pars_fragment

void main() {
    vec3 normal=normalize(vNormal);
    vec3 Day=texture2D(uDay,vUv).rgb;
    vec3 Night=texture2D(uNight,vUv).rgb;
    vec3 Clouds=texture2D(uClouds,vUv).rgb;

    vec3 sunPosition=uLightPosition;
    vec3 sunDirection=normalize(sunPosition*-1.0);

    //夜间灯光的混合程度
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


    float atmosphere=smoothstep(-0.,0.5,sunOrientation);


//    gl_FragColor = vec4(vec3(Clouds.r),1.);
    gl_FragColor = vec4(vec3(atmosphere),1.);
//    gl_FragColor = vec4(uColorCenter,1.);
//    gl_FragColor = vec4(vec3(p),1.);
//    gl_FragColor = vec4(vec3(cloudsMix),1.);
//        gl_FragColor = vec4(vec3(lightIntensity),1.);
    
    ///logdepthbuf_fragment
//    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
