uniform sampler2D uTextureMain;
uniform sampler2D uTextureOpacity;
varying vec2 vUv;
void main() {
    vec4 imgMain=texture2D(uTextureMain, vUv);
    vec4 imgOpacity=texture2D(uTextureOpacity, vUv);

    // 将黑白图像的亮度值作为透明度，白色为不透明，黑色为完全透明
    float opacity = imgOpacity.r; // 这里假设黑白图像只有一个通道

    // 使用彩色图像的颜色值，并将黑白图像的亮度值作为透明度
    gl_FragColor = vec4(imgMain.rgb, imgOpacity);
//    gl_FragColor = imgMain * imgOpacity; // 使用纹理
//    gl_FragColor =imgOpacity; // 使用纹理
}
