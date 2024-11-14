///logdepthbuf_pars_fragment
void main() {
    gl_FragColor = vec4(0.3,0.5,0.7,0.5);

    ///logdepthbuf_fragment
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
