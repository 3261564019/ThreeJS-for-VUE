import * as THREE from "three";
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import {AnimationAction, AnimationClip, AnimationMixer, Object3D, ShaderMaterial} from "three";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
// import dancerFbx from "/src/assets/model/sambaDancing.fbx?url"
import dancerFbx from "/src/assets/model/热舞/WaveHipHopDance.fbx?url"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {load} from "@amap/amap-jsapi-loader";
import girl from "@/assets/model/111.gltf?url"


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
    animationList:Array<{
        obj:Object3D,
        animationMixer:AnimationMixer,
        action:AnimationAction
    }>;


    constructor() {
        super({
            needLight:false,
            renderDomId:"#webGl",
            needOrbitControls:true,
            needAxesHelper:true,
            renderBg:"#282c34"
        } as BaseInitParams);

        this.animationList=[];
        this.initDebug();

        this.init();

        this.addPlan();

        this.addLight();

        // this.addBall();

        // this.addModel()

        this.loadMyModel();
    }
    loadMyModel(){
        const loader = new GLTFLoader();
        loader.load(girl,(res)=>{
            console.log("模型对象res",res)
            res.scene.position.y=10
            this.scene.add(res.scene)
        })

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
        const light = new THREE.SpotLight("#fff");
        light.castShadow = true;            // default false
        light.position.x = 20;
        light.position.y = 30;

        const ambientLight = new THREE.AmbientLight("#fff"); // 柔和的白光


        this.scene.add(ambientLight);
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

            this.raf=requestAnimationFrame(animate);
        }

        animate();

    }
}
