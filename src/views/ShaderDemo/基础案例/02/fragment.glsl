uniform sampler2D uTextureMain;
uniform sampler2D uTextureOpacity;
varying float VPointRandom;
varying vec2 vUv;
varying vec4 VModelPosition;

void main() {
    vec4 imgMain=texture2D(uTextureMain, vUv);
    vec4 imgOpacity=texture2D(uTextureOpacity, vUv);

    float opacity = imgOpacity.r; // 这里假设黑白图像只有一个通道

    vec3 mainColor=imgMain.rgb;

    gl_FragColor = mix(vec4(0.6, 0.6, 0.6,1.0),vec4(1,1, 1,1.0),VModelPosition.z);
}
