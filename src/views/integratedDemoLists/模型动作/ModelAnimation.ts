import * as THREE from "three";
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import {AnimationAction, AnimationClip, AnimationMixer, Object3D, ShaderMaterial} from "three";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
// import dancerFbx from "/src/assets/model/sambaDancing.fbx?url"
import dancerFbx from "/src/assets/model/热舞/WaveHipHopDance.fbx?url"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {load} from "@amap/amap-jsapi-loader";
import girl from "@/assets/model/111.gltf?url"
import boxMan from "@/assets/model/box_man.glb?url"
import test from "@/assets/model/bart.glb?url"
import tree from "@/assets/model/tree.glb?url"
import aa from "./aa.glb?url"
// import ani from "@/assets/model/break.glb?url"
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {captureBoxMan} from "@/views/integratedDemoLists/SketchBoxControl/hooks/mesh/character";

function clone( source:any ) {

    const sourceLookup = new Map();
    const cloneLookup = new Map();

    const clone = source.clone();

    parallelTraverse( source, clone, function ( sourceNode:any, clonedNode:any ) {

        sourceLookup.set( clonedNode, sourceNode );
        cloneLookup.set( sourceNode, clonedNode );

    } );

    clone.traverse( function ( node:any ) {

        if ( ! node.isSkinnedMesh ) return;

        const clonedMesh = node;
        const sourceMesh = sourceLookup.get( node );
        const sourceBones = sourceMesh.skeleton.bones;

        clonedMesh.skeleton = sourceMesh.skeleton.clone();
        clonedMesh.bindMatrix.copy( sourceMesh.bindMatrix );

        clonedMesh.skeleton.bones = sourceBones.map( function ( bone:any ) {

            return cloneLookup.get( bone );

        } );

        clonedMesh.bind( clonedMesh.skeleton, clonedMesh.bindMatrix );

    } );

    return clone;

}




// @ts-ignore
function parallelTraverse( a, b, callback ) {

    callback( a, b );

    for ( let i = 0; i < a.children.length; i ++ ) {

        parallelTraverse( a.children[ i ], b.children[ i ], callback );

    }

}


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
    animationIndex:1
}

export class ModelAnimation extends BaseInit {

    planMaterial:ShaderMaterial
    // 动画混合器
    animationMixer:AnimationMixer
    //animationList
    animationList: Map<string, AnimationAction> = new Map();
    private tempMixer: AnimationMixer;


    constructor() {
        super({
            needLight:true,
            renderDomId:"#webGl",
            needOrbitControls:true,
            needAxesHelper:true,
            renderBg:"#282c34"
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.addPlan();

        this.addLight();

        this.addBall();

        // this.addModel()

        this.loadMyModel();

        // this.loadBoxMan();

        // this.loadAniMan()
        // this.loadAnimation()
    }
    loadMyModel(){
        const loader = new GLTFLoader();
        loader.load(aa,(res)=>{
            console.log("模型对象resaaa",res)
        })

    }
    loadBoxMan(){
        const loader = new GLTFLoader();
        loader.load(boxMan,(res)=>{
            console.log("模型对象res",res)
            res.scene.scale.set(10,10,10)
            res.scene.position.y=1
            this.animationMixer =new AnimationMixer(res.scene);
            res.animations.forEach((v)=>{
                this.animationList.set(v.name,this.animationMixer.clipAction(v))
            })
            captureBoxMan(res.scene)
            this.scene.add(res.scene)
            this.debugBoxMan();

        })
    }
    loadAniMan(){
        const loader = new GLTFLoader();
        loader.load(ani,(res)=>{
            console.log("模型对象res",res)
            res.scene.scale.set(10,10,10)
            res.scene.position.y=20
            this.animationMixer =new AnimationMixer(res.scene);
            res.animations.forEach((v)=>{
                let a= this.animationMixer.clipAction(v)
                a.play()
            })
            this.scene.add(res.scene)
            // this.debugBoxMan();

        })
    }
    showAllWeight(){
        this.animationList.forEach((v,k)=>{
            console.log(k+" \t ---- "+v.weight+" \t time:"+v.time)
        })
    }
    debugBoxMan(){
        // 加载并播放第一个动作
        const action1 = this.animationList.get("run");
        // 加载并准备第二个动作
        const action2 = this.animationList.get("idle");

        let temp={
            idle:()=>{
                this.animationList.get("idle").play()
            },
            currentAction:"",
            test1:()=>{
                //jump_running stop


                    // @ts-ignore
                action1.play();

                setTimeout(()=>{
                    this.showAllWeight();
                    // @ts-ignore
                    action1.fadeOut(1)
                    // @ts-ignore
                    action2.reset().fadeIn(1).play()
                },2000)
                // setTimeout(()=>{
                //     action1?.reset()
                // },1000)
                // action1.crossFadeTo( action2, 0.2, true );

            },
            test2:()=>{
                action2.fadeOut(2)
                action1.reset().fadeIn(2).play()
            },
            test3:()=>{
                action1.play()

                setTimeout(()=>{
                    this.animationMixer.stopAllAction();
                    action2.fadeIn(0.2);
                    action2.play();
                },2000)
            },
            print:this.showAllWeight.bind(this),
            test4:()=> {
                this.animationList.forEach(action=>{
                    if (action.isRunning()) {
                        // 如果当前动画正在运行，淡出它
                        action.fadeOut(1);  // 1秒内淡出
                    }
                })
                const falling = this.animationList.get("falling");

                // 重置并淡入目标动画
                falling.reset().fadeIn(1).play(); // 1秒内淡入并播放
            }
        }
        let names={}
        let keysIterator=this.animationList.keys()

        // 遍历迭代器并输出所有键
        for (let key of keysIterator) {
            // @ts-ignore
            names[key]=key
            // console.log(key)
        }

        this.dat.add(temp,"currentAction", names).onFinishChange(e=>{
            console.log(e)
            this.animationMixer.stopAllAction(); // 停止所有正在播放的动画

            this.animationList.get(e).play()
        })
        this.dat.add(temp,"idle").name("休息")
        this.dat.add(temp,"test1").name("跑步换休息")
        this.dat.add(temp,"test2").name("休息换跑步（切换间隔 2）")
        this.dat.add(temp,"test3").name("Play跑步")
        this.dat.add(temp,"test4").name("切换图中打断")

        this.dat.add(temp,"print").name("查看状态")
    }
    addModel(){

        let  tempMaterial = new THREE.MeshBasicMaterial({ color:"#0d6ecc", transparent: true, opacity: 0.5 });
        const loader = new FBXLoader();
        loader.load(dancerFbx, (object) => {

            console.log("模型对象",object)
            object.traverse(function (child) {
                // @ts-ignore
                if (child.isMesh) {
                    console.log("isMesh",child)
                    child.castShadow = true;
                    child.receiveShadow = true;
                    // child.material =tempMaterial
                }
            });
            object.position.set(-0,0,0)
            object.scale.set(0.10,0.10,0.10)

            this.scene.add(object)

            let obj=object.clone()
            obj.position.set(18,0,0)
            obj.scale.set(0.20,0.20,0.20)
            this.scene.add(obj)


            // for(let i=0;i<3;i++){
            //
            //     let animationMixer=new AnimationMixer(this.scene);
            //     let obj=clone(object);
            //     console.log("人体对象", object);
            //
            //     console.log("复制出来的",obj)
            //
            //     let action:AnimationAction=animationMixer.clipAction(clone(object.animations[0]));
            //     obj.position.set(i*10,0,0);
            //     this.scene.add(obj);
            //     // action.play()
            //     this.animationList.push({
            //         obj,
            //         animationMixer,
            //         action
            //     })
            // }

            this.animationMixer = new AnimationMixer(object);
            this.scene.add(object);
            //
            const action = this.animationMixer.clipAction(object.animations[0]);
            action.play();


            // setTimeout(()=>{
            //     this.animationList.forEach(item=>{
            //         item.action.play()
            //     })
            // },5000)


        });

        const gltfLoader = new GLTFLoader();

        loader.load(
            "https://dddance.party/models/pepe2/cheering.gltf",(e)=>{
                console.log("eee",e)
                e.position.set(50,0,0)
                this.scene.add(e)

            })
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
        const light = new THREE.SpotLight("#fff",2000);
        light.castShadow = true;            // default false
        light.position.x = 10;
        light.position.y = 30;
        light.position.z = 20;

        // const ambientLight = new THREE.AmbientLight("#fff",30); // 柔和的白光


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

            // this.animationList.forEach(({animationMixer})=>{
            //     animationMixer.update(delta)
            // })

            if (this.animationMixer) {
                this.animationMixer.update(delta);
            }
            if (this.tempMixer) {
                this.tempMixer.update(delta);
            }

            this.raf=requestAnimationFrame(animate);
        }

        animate();

    }
}
