varying vec2 vUv;
void main() {
    /**
     uv的y是从下到上为0-1
     uv的x是从左到右为0-1
      */
     vec3 color=vec3(vUv.y * 10.0);

    gl_FragColor = vec4(color,1.0);
}
