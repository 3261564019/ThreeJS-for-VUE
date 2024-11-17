uniform sampler2D uTexture;
uniform vec3 uColor;
float remap(float value,float originMin,float originMax,float destinationMin,float destinationMax){
    return destinationMin + (value - originMin) * (destinationMax -destinationMin)/(originMax - originMin);
}
///logdepthbuf_pars_fragment
void main() {


    vec4 imgMain=texture2D(uTexture,gl_PointCoord);


    float r=remap(5.0,0.0,10.0,0.0,1.0);

    gl_FragColor =vec4(uColor,imgMain.r);
//    gl_FragColor =vec4(r);

    ///logdepthbuf_fragment
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
