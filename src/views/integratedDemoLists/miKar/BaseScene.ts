import * as THREE from "three";
import {Clock, CubeCamera, Mesh, Texture} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit.js";
import clarens_night_02_4k from "@/assets/hdr/clarens_night_02_4k.hdr?url";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
// import su7 from "@/assets/model/su71.glb?url"
import su7 from "@/assets/model/mesh/sm_car.gltf?url"
import {MeshoptDecoder} from "three/examples/jsm/libs/meshopt_decoder.module.js"
import {makeSeriesEncodeForAxisCoordSys} from "echarts/types/src/data/helper/sourceHelper";

export class BaseScene extends BaseInit {
    envMap:Texture
    private cubeCamera: CubeCamera;
    sphere:Mesh
    clock: Clock;
    constructor() {
        super({
            needLight:false,
            renderDomId:"#renderDom",
            needOrbitControls:true
        } as BaseInitParams);

        this.initDebug();

        this.clock=new Clock();
        this.init();


        this.loadEnv()

        this.addLight()

        this.animate()
        this.loadModel()
    }
    loadModel(){
        let loader = new GLTFLoader()
        loader.setMeshoptDecoder(MeshoptDecoder)
        loader.load(su7,(e)=>{

            let obj=e.scene
            let face=obj.getObjectByName("Object_18")

            const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
                minFilter: THREE.LinearMipMapLinearFilter,
                anisotropy: 0,
                depthBuffer: true,
                generateMipmaps: true,
            });
            cubeRenderTarget.texture.type = THREE.UnsignedByteType;
            this.cubeCamera = new THREE.CubeCamera( 1, 1000, cubeRenderTarget );
            this.scene.environment = cubeRenderTarget.texture;

            // e.scene.traverse(v=>{
            //     if(v.isMesh){

                    // face.material=new THREE.MeshStandardMaterial({
                    //     envMap: cubeRenderTarget.texture,
                    //     // color:"#1f65b8",
                    //     roughness: 0.05,
                    //     metalness: 1,
                    //     opacity:1,
                    //     transparent: true,
                    // })
            //     }
            // })
            // face.material.envMap=cubeRenderTarget.texture
            // face.material.metalness=1;
            // face.material.roughness=0.05;

            // face.material=new THREE.MeshStandardMaterial({
            //     // color:"#1f65b8",
            //     roughness: 0.05,
            //     metalness: 1,
            //     opacity:1,
            //     transparent: true,
            // })

            // console.log("face",face)
            this.scene.add(obj)
            // face.position.y=2;
            // this.scene.add(face)
        })
    }
    loadEnv(){
        new RGBELoader().load(clarens_night_02_4k, (texture) => {
            console.log("纹理对象", texture);

            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.encoding = THREE.sRGBEncoding;
            this.envMap=texture
            this.scene.environment = texture;
            this.scene.background = texture;

            this.addBall();
            this.addPlan();
            this.manualRender()
        });
    }
    addPlan(){

        const geometry = new THREE.PlaneGeometry(40, 40);
        const material = new THREE.MeshLambertMaterial({color: "#fff"});
        material.side=THREE.DoubleSide
        material.envMap=this.envMap;
        const plane = new THREE.Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true
        plane.rotation.x = -0.5 * Math.PI;
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
        light.position.x = 0;
        light.position.y = 20;
        light.position.z = 0;

        this.scene.add(light);
    }
    addBall(){

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(3, 33, 33),
            new THREE.MeshLambertMaterial({color: "#00f"})
        );
        sphere.position.x = 10;
        sphere.position.y = 5;
        sphere.castShadow = true

        this.sphere=sphere
        this.scene.add(sphere);
    }
    init() {

        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.7;
        this.dat.add(this.renderer,"toneMappingExposure",0.1,2).name("曝光")
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 30, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

    }
    animate(){
        this.stats.update()

        this.raf=requestAnimationFrame(this.animate.bind(this));

        if(this.sphere){
            let e=this.clock.getElapsedTime()
            let r=8
            this.sphere.position.set(Math.sin(e)*r,3,Math.cos(e)*r)
        }

        this.renderer.render(this.scene, this.camera);
        this.cubeCamera?.update( this.renderer, this.scene );

    }
}