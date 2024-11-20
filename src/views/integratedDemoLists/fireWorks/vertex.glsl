uniform float uSize;
uniform float uProgress;
uniform vec2 uResolution;
uniform vec3 origin;
attribute float rSize;
attribute float rTimeScale;

///logdepthbuf_pars_vertex
bool isPerspectiveMatrix(mat4) {
    return true;
}
/**
value：需要被映射的数值。
originMin：原始范围的最小值。
originMax：原始范围的最大值。
destinationMin：目标范围的最小值。
destinationMax：目标范围的最大值。

示例 1: 将 5 从范围 [0, 10] 映射到 [0, 1]
let result1 = remap(5, 0, 10, 0, 1);
console.log(result1); // 输出: 0.5

**/
float remap(float value,float originMin,float originMax,float destinationMin,float destinationMax){
    return destinationMin + (value - originMin) * (destinationMax -destinationMin)/(originMax - originMin);
}

void main(){

    vec3 newPosition =position;

    float uProgress=uProgress*rTimeScale;

    //爆炸
    //先将0-0.3映射成0-1
    float explodingProgress=remap(uProgress,0.0,0.3,0.0,1.0);
    //但是如果uProgress大于0.3，其结果就会大于1，此时使用clamp钳制
    explodingProgress=clamp(explodingProgress,0.0,1.0);
    //保证爆炸速度是先快后慢
    explodingProgress=1.0 - pow(1.0 - explodingProgress,3.0);
    newPosition*=explodingProgress;

    /**
        停顿总动画时间的10%后开始下落
        动画在 uProgress < 0.1 时无效（fallingProgress == 0）
        动画进度小于0.1时不进行下落
        当 uProgress 接近 1.0 时，fallingProgress 接近 1.0
    **/
    float fallingProgress=remap(uProgress,0.1,1.0,0.0,1.0);
    //将 fallingProgress 限制在 [0.0, 1.0] 范围内。
    fallingProgress=clamp(fallingProgress,0.0,1.0);
    /**
        当uProgress < 0.1 时，fallingProgress为0
        以下表达式在fallingProgress为0时返回值也是0
    **/
    fallingProgress=1.0 - pow(1.0 - fallingProgress,3.0);
    //控制下落距离
    newPosition.y-=fallingProgress*0.2;


    /**
        缩放
    **/
    float t=0.125;;
    float open=remap(uProgress,0.0,t,0.0,1.0);
    float close=remap(uProgress,t,1.0,1.0,0.0);
    float sizeProgress=clamp(min(open,close),0.0,1.0);

    /**
        闪烁
    **/
    //闪烁程度
    float blinkProgress=clamp(remap(uProgress,0.2,0.9,0.0,1.0),0.0,1.0);
    float sizeTwink=sin(uProgress*39.3)*0.5+0.5;
    float blinkRes=1.0-blinkProgress * sizeTwink;

    vec4 modelPosotion=modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition=viewMatrix * modelPosotion;
    gl_Position = projectionMatrix * viewPosition ;

    //sizeProgress
    gl_PointSize=uSize * uResolution.y * 0.02f * rSize * sizeProgress * blinkRes;
    //近大远小的透视
    gl_PointSize*=1.0 / - viewPosition.z;

    ///logdepthbuf_vertex
}
    