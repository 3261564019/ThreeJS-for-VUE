import * as THREE from "three";
import {physicsBaseScene} from "../BaseScene";
import {ChildScene} from "../types";
import {ShaderMaterial, Vector3} from "three";


var vertexShader = `
    uniform float time;
    varying vec3 pos;
    void main()	{
      pos = position;
      vec3 p = position;
      // p.y = sin(p.x * .1 - time) * cos(p.z * .1 - time) * 2.;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
    }
  `;

var fragmentShader = `
    /* based on http://madebyevan.com/shaders/grid/ */
  
    varying vec3 pos;
    uniform float time;
    
    float line(float width, vec3 step){
      vec3 tempCoord = pos / step;
      
      vec2 coord = tempCoord.xz;

      vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord * width);
      float line = min(grid.x, grid.y);
      
      return 1. - min(line, 1.0);
    }
    
    void main() {
      float v = line(1., vec3(1.)) + line(1.5, vec3(10.));      
      vec3 c = v * vec3(0., 1., 1.) * (sin(time * 5. - length(pos.xz) * .5) * .5 + .5);
      c = mix(vec3(0.5), c, v);
      
      gl_FragColor = vec4(c, 1.0);
    }
  `;

export class PlanerBasePlane implements ChildScene{

    private readonly planMaterial:ShaderMaterial;

    constructor(ins:physicsBaseScene,position:Vector3) {
        const geometry = new THREE.PlaneGeometry(40, 40, 100, 100);
        geometry.rotateX(-Math.PI * .5);
        this.planMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms:{
                time:{
                    value:0
                }
            },
            extensions: {derivatives: true}
        });
        this.planMaterial.side=THREE.DoubleSide
        const plane = new THREE.Mesh(geometry, this.planMaterial);
        //设置接受阴影
        plane.receiveShadow = true
        plane.position.copy(position)
        //添加地板容器
        ins.scene.add(plane);
    }


    render(delta:number, elapsedTime:number){
        this.planMaterial.uniforms.time.value=elapsedTime
    }

}