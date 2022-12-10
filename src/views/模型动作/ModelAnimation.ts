import * as THREE from "three";
import gsap from 'gsap';
import {BaseInit, BaseInitParams} from "../../three/classDefine/baseInit";
import {AnimationClip, AnimationMixer, ShaderMaterial} from "three";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
// import dancerFbx from "/src/assets/model/sambaDancing.fbx?url"
import dancerFbx from "/src/assets/model/热舞/WaveHipHopDance.fbx?url"



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

let  debugParam={
    animationIndex:0
}

export class ModelAnimation extends BaseInit {

    planMaterial:ShaderMaterial
    // 动画混合器
    animationMixer:AnimationMixer



    constructor() {
        super({
            needLight:false,
            renderDomId:"#webGl",
            needOrbitControls:true,
            needAxesHelper:true,
            renderBg:"#282c34"
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.addPlan();

        this.addLight();

        // this.addBall();

        this.addModel()
    }
    addModel(){
        const loader = new FBXLoader();
        loader.load(dancerFbx, (object) => {

            this.animationMixer = new AnimationMixer(object);

            console.log("人体对象", object);

            console.log(this,"调试工具")
            this.dat.add(debugParam,"animationIndex",{
                "动画1":0,
                "动画2":1,
                "动画3":2,
            }).onFinishChange(
                e=>{
                    const action = this.animationMixer.clipAction(object.animations[e*1]);
                    action.play();
                    console.log("下标",e);
                }
            ).name("当前动画")

            object.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            object.scale.set(0.1, 0.1, 0.1);
            object.position.set(0, 0, 0);
            this.scene.add(object);
        });
    }
    addPlan(){

        const geometry = new THREE.PlaneGeometry(50, 50, 100, 100);
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
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        //添加地板容器
        this.scene.add(plane);

    }
    addLight(){

        //创建聚光灯
        const light = new THREE.SpotLight("#fff");
        light.castShadow = true;            // default false
        light.position.x = 20;
        light.position.y = 30;

        this.scene.add(light);
    }
    addBall(){

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(3, 33, 33),
            new THREE.MeshLambertMaterial({color: "#fff"})
        );

        sphere.position.x = 10;
        sphere.position.y = 3;
        sphere.castShadow = true

        this.scene.add(sphere);
    }
    init() {

        this.renderer.shadowMap.enabled = true;

        this.camera.position.set(0, 30, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

        const clock = new THREE.Clock();

        const animate = () => {

            // console.log(clock.getElapsedTime());
            // ElapsedTime=clock.getElapsedTime();
            const delta = clock.getDelta();

            if(this.planMaterial){
                this.planMaterial.uniforms.time.value=clock.getElapsedTime()
            }

            this.stats.update()
            this.renderer.render(this.scene, this.camera);

            if (this.animationMixer) {
                this.animationMixer.update(delta);
            }
            requestAnimationFrame(animate);
        }

        animate();

    }
}