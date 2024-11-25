varying float vheight;
uniform float uBigWave;
uniform vec2 uFrequency;
uniform float uTime;
uniform float uSpeed;
uniform float uShiftOffset;
uniform float uNoiseSpeed;
uniform float uNoiseScale;
uniform float uNoiseStrength;
//当前片元到中心点的距离
varying vec2 vUv;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vMaxHeight;

#include /src/shaders/chunk/PerlinNoise3D.glsl;

//三次小迭代
float multipleElevation(
    vec3 editPosition,
    vec2 uFrequency,
    float uTime,
    float uSpeed,
    float uBigWave
){
    /*
        类似网格状的整体的，大的运动
    */
    float height=sin(editPosition.x * uFrequency.x + uTime * uSpeed) *
    sin(editPosition.z * uFrequency.y + uTime * uSpeed) * uBigWave;

    /*
        在原来基础的高度加上噪波的高度，会有很多圆润的突起
        如果减去噪波高度，会形成很锋利的边缘
    */
    float iterations=2.0;
    // 噪波影响程度
    float degreeOfNoiseImpact[3] = float[3](1.8,1.2,0.6);

    for (float i=0.0;i<iterations;i++){
        /**
            这个值越大，uv会被缩放的倍数会变大
            噪波的密集程度会变大
            这里的值是4到3递减
            float strength=4.0 - i;
        **/
        //        float strength=i;
        float strength=iterations+1.0- i;

        float noise=PerlinNoise3D(vec3(editPosition.xz*0.03 * uNoiseScale + strength, uTime*uNoiseSpeed))*uNoiseStrength;

        height-=abs(noise) * degreeOfNoiseImpact[int(i)];
        //        height-=abs(noise) ;
        //        height *= degreeOfNoiseImpact[int(i)];
    }

    return height;
}

void main(){

    vec3 editPosition=position;

    float mHeight = abs(uBigWave); // 计算理论上的最大高度
    //进行三次迭代得到更小的波浪
    float height=multipleElevation(editPosition,
    uFrequency,
    uTime,
    uSpeed,
    uBigWave);
    //计算的高度应用于局部坐标系
    editPosition.y=height;

    float shift=uShiftOffset;
    /*
        法向是整体向上的，为了得到正确结果，需要保证z是负向的
        先从当前位置偏移再取出两个点
    */
    vec3 toA=editPosition+vec3(shift,0.,0.);
    vec3 toB=editPosition+vec3(0.,0.,-shift);
    //计算出两个点的高度
    float heightA=multipleElevation(toA,
    uFrequency,
    uTime,
    uSpeed,
    uBigWave);

    float heightB=multipleElevation(toB,
    uFrequency,
    uTime,
    uSpeed,
    uBigWave);

    toA.y=heightA;
    toB.y=heightB;

    vec3 directionA=normalize(toA-editPosition);
    vec3 directionB=normalize(toB-editPosition);

    vec3 normalA=cross(directionA,directionB);


    //模型矩阵*局部坐标系的位置得到世界坐标系的位置
    vec4 mp=modelMatrix * vec4(editPosition, 1.0);

    //临时测试用于查看噪波函数的结果
    //vheight=PerlinNoise3D(vec3(uv*10.0,uTime));




    gl_Position = projectionMatrix * viewMatrix * mp;


    //将高度传到片元着色器用于计算颜色
    vheight=editPosition.y;
    vUv=uv;
//    vNormal=(modelMatrix * vec4(normalA, 0.0)).xyz;
//    vNormal = normalize((modelMatrix * vec4(normalA, 0.0)).xyz);
//    vNormal = normalize(normalMatrix * normalA);

    vNormal=normalize(normalA);
//    vNormal=normalA;
    vPosition=mp.xyz;
    vMaxHeight=mHeight;
}
    