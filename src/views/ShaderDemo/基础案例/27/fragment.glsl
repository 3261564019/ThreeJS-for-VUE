precision mediump float;
#define PI 3.141592653589
uniform sampler2D uTextureWall; // 第一张纹理
uniform sampler2D uTextureTrack; // 第二张纹理
uniform float uTime;
uniform float uRate;
uniform float uFade;
uniform float uScale;
uniform float uContrast;
varying vec2 vUv; // 传入的纹理坐标



vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
float cnoise(vec2 P){
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 *
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

// 调整对比度的函数
vec4 adjustContrast(vec4 color, float contrast) {
    // 计算灰度值
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));

    // 调整对比度
    float contrastedGray = (gray - 0.5) * contrast + 0.5;

    // 限制结果在 [0, 1] 范围内
    contrastedGray = clamp(contrastedGray, 0.0, 1.0);

    // 返回调整后的颜色
    return vec4(vec3(contrastedGray), color.a);
}

// 封装旋转UV坐标的函数
vec2 rotateUV(vec2 uv, vec2 center, float angle) {
    // 计算旋转矩阵
    float cosTheta = cos(angle);
    float sinTheta = sin(angle);
    mat2 rotationMatrix = mat2(cosTheta, -sinTheta, sinTheta, cosTheta);

    // 将UV坐标平移到中心
    vec2 centeredUv = uv - center;

    // 应用旋转矩阵
    vec2 rotatedUv = rotationMatrix * centeredUv;

    // 将UV坐标平移回原位置
    return rotatedUv + center;
}


void main() {

    vec2 rUv = rotateUV(vUv,vec2(0.5,0.5),0.8);

    float color=cnoise(vUv * 10.0);


    vec4 imgWall = texture2D(uTextureWall, vUv);



    vec4 imgTrack = texture2D(uTextureTrack, rUv);

    float step=uTime*0.1;
    float dis=uFade;
    // 计算混合因子，基于时间和垂直位置
//    float blendFactor = smoothstep(step-dis,step+dis,step);
    float blendFactor = smoothstep(uRate-dis,uRate+dis,vUv.y);


    // 计算正片叠底颜色
    vec4 multiplyColor = imgWall * adjustContrast(imgTrack,uContrast).r;
//    vec4 multiplyColor = imgWall * imgTrack;

    // 使用线性插值混合颜色
    vec4 resultColor = mix(imgWall, multiplyColor, blendFactor * uScale);
//    vec4 resultColor = mix(imgWall, multiplyColor, sin(vUv));

    // 输出结果颜色
    gl_FragColor = resultColor;

//    gl_FragColor = adjustContrast(imgTrack,uContrast);

//    gl_FragColor = vec4(blendFactor,blendFactor,blendFactor,1);
}
