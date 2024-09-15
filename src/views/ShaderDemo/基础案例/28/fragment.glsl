uniform sampler2D videoTexture;
varying vec2 vUv; // 传入的纹理坐标
uniform vec3 keyColor;
uniform float tolerance;     // 容差值
uniform float smoothness;    // 平滑度
 void main() {

     vec4 videoColor = texture2D(videoTexture, vUv);


     // 计算当前像素颜色和键颜色之间的距离
     float dist = distance(videoColor.rgb, keyColor);

     // 使用容差和平滑度来计算透明度
     float alpha = smoothstep(tolerance - smoothness, tolerance + smoothness, dist);

     videoColor.a=alpha;
     // 设置输出颜色，透明度根据计算结果调整
     gl_FragColor = vec4(videoColor);

//    gl_FragColor =videoColor;
//    gl_FragColor =vec4(alpha);
}
