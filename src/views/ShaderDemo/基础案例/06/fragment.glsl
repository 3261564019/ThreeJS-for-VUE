varying vec2 vUv;
void main() {

    vec2 uv=vUv;

    /**
        y本来是从0到1的，将其*10就会从0到10，存在十个1，
        将这每个1取余10，会得到其自身，也就是10个0-1的数，因此该图案形成了梯度渐变

        uv.y * 10.0 将纵向坐标的范围从 0 到 1 扩展到 0 到 10。然后
        mod(uv.y * 10.0, 1.0) 运算将结果限制在 0 到 1 之间，这就形成了一个周期为 1 的渐变效果
    **/
    float numY=mod(uv.y * 10.0 + 0.2, 1.0);
    float numX=mod(uv.x * 10.0 + 0.2, 1.0);
    // 小于0.4的返回黑色，可绘制出垂直与x轴的竖向的线条
    float barX=step(0.4 ,numX);
    //小于0.8的都是0,0*原来的颜色，即为黑色
    barX*=step(0.8,numY);

    //x轴的线条，小于0.8皆为黑色 0.2的部分是白色，因此形成白色线条
    float barY=step(0.8,numX);
    //在y轴方向,0.4的部分为黑色,其他的部分是白色
    barY*=step(0.4,numY);


    float f=barX+barY;



    vec3 color=vec3(f);

    gl_FragColor = vec4(color, 1);
}
