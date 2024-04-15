uniform sampler2D uTextureMain;
uniform sampler2D uTextureOpacity;
varying vec2 vUv;
void main() {
    vec4 imgMain=texture2D(uTextureMain, vUv);
    vec4 imgOpacity=texture2D(uTextureOpacity, vUv);

    float opacity = imgOpacity.r; // 这里假设黑白图像只有一个通道

    gl_FragColor = vec4(imgMain.rgb, imgOpacity);
}
