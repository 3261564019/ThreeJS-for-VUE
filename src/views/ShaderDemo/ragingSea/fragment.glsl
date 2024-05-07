#define PI 3.141592653589
varying float vheight;
uniform vec3 uHeightColor;
uniform vec3 uDepthColor;
uniform float uMixMultiple;
uniform float uOffset;
varying vec2 vUv;
void main() {
    vec3 color=mix(uDepthColor,uHeightColor,(vheight * uMixMultiple) + uOffset);
    float dis=distance(vUv,vec2(0.5,0.5));

    float opacity=sin(vUv.x * (-PI*3.0)) +0.5;
    gl_FragColor = vec4(color,1.0);
//    gl_FragColor = vec4(uHeightColor,1.0);
}
