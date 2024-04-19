varying vec2 vUv;
void main() {
    /**
     uv的y是从下到上为0-1
     uv的x是从左到右为0-1

     color中rgb的取值都超过1，显示的依然是白色
     因此，将uv的y*10后会快速从黑色到白色，后面全是白色
      */
     vec3 color=vec3(vUv.y * 10.0);

    gl_FragColor = vec4(color,1.0);
}
