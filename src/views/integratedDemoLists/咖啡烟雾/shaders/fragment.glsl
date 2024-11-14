varying vec2 vUv;
uniform sampler2D uNoiseTexture;
uniform float uTime;
///logdepthbuf_pars_fragment
void main() {

    vec2 smokeUv=vUv;

    smokeUv.x*=0.5;
    smokeUv.y*=0.3;
    smokeUv.y-=uTime*0.2;

    vec4 imgMain=texture2D(uNoiseTexture, smokeUv);

    float c=imgMain.r;

    c=smoothstep(0.24,1.0,c);

    c*=smoothstep(0.0,0.2,vUv.x);

    c*=1.0-smoothstep(0.8,1.0,vUv.x);

    c*=smoothstep(0.0,0.2,vUv.y);
    c*=1.0-smoothstep(0.75,1.0,vUv.y);

    gl_FragColor = vec4(0.6,0.3,0.2,c);
    //gl_FragColor = vec4(1);
    ///logdepthbuf_fragment
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
