uniform sampler2D uTexture;
///logdepthbuf_pars_fragment
void main() {


    vec4 imgMain=texture2D(uTexture,gl_PointCoord);

    gl_FragColor = imgMain;

    ///logdepthbuf_fragment
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
