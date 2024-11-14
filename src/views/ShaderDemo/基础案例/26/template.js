import { DoubleSide, ShaderChunk, ShaderMaterial } from "three";

const vertex = `
${ShaderChunk.logdepthbuf_pars_vertex}
bool isPerspectiveMatrix(mat4) {
    return true;
}

varying vec4 m_pos;
varying vec2 vUv;

void main () {
    vUv = uv;
    // 从贴图中采样颜色值
    vec3 newPosition = normal*vec3(0,0,0)+position;//vec3中为xyz三点空间上偏移量
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

      ${ShaderChunk.logdepthbuf_vertex}
}
    `;

// 片元着色器代码
const fragment = `
${ShaderChunk.logdepthbuf_pars_fragment}
precision mediump float;
varying vec2 vUv;
uniform float uTime;

void main() {
    gl_FragColor =vec4(vUv.x,vUv.y,1.0,vUv.x);//颜色 透明度0--1
  ${ShaderChunk.logdepthbuf_fragment}
}
    `;

;
const _01_default =  new ShaderMaterial({
    uniforms: {
      uTime: { value: 1.0 },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    side: DoubleSide,
    depthWrite:false,
    transparent: true,
  });

export default _01_default
 
