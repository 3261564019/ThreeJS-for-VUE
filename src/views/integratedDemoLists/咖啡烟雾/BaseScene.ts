import {
    ACESFilmicToneMapping, Clock,
    DoubleSide, FrontSide,
    Mesh,
    MeshLambertMaterial, PCFSoftShadowMap,
    PlaneGeometry, RepeatWrapping, ShaderChunk, ShaderMaterial,
    SpotLight, SpotLightHelper
} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import table from "@/assets/model/table.glb?url"
import fragment from "./shaders/fragment.glsl"
import vertex from "./shaders/vertex.glsl"
import noisePic from "@/assets/img/noiseTexture.png?url"

export class BaseScene extends BaseInit {

    clock=new Clock();
    uniforms=null

    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            needAxesHelper:false,
            needTextureLoader:true,
            transparentRenderBg:true,
            renderDomId:"#renderDom"
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.loadModal();
        // this.addPlan();

        this.addLight();

        this.addPlan();

        this.animate()
    }

    loadModal(){
        let loader = new GLTFLoader()
        loader.load(table, (e) => {
            //@ts-ignore
            // console.log("模型加载结果", e.scene.children[0].material)

            e.scene.scale.set(10,10,10)
            // e.scene.updateMatrix();

            e.scene.traverse(v=>{
                v.receiveShadow=true;
                v.castShadow=true;
                if(v instanceof Mesh){
                    v.material.side=FrontSide
                }
            })


            // e.scene.children[0].material=this.depth;
            //@ts-ignore


            this.scene.add(e.scene);
        })
    }
    addPlan(){
        let v=vertex.replace("///logdepthbuf_pars_vertex",ShaderChunk.logdepthbuf_pars_vertex)
        v=v.replace("///logdepthbuf_vertex",ShaderChunk.logdepthbuf_vertex)

        let f=fragment.replace("///logdepthbuf_pars_fragment",ShaderChunk.logdepthbuf_pars_fragment)
        f=f.replace("///logdepthbuf_fragment",ShaderChunk.logdepthbuf_fragment)

        const noise=this.textureLoader.load(noisePic);
        noise.wrapS=noise.wrapT=RepeatWrapping

        const geometry = new PlaneGeometry(1.5,6,14, 64);
        const material = new ShaderMaterial({
            wireframe:false,
            fragmentShader:f,
            transparent:true,
            vertexShader:v,
            uniforms:{
                uNoiseTexture:{
                    value:noise
                },
                uTime:{
                    value:0
                }
            }
        });

        this.uniforms=material.uniforms;

        material.side=DoubleSide
        const plane = new Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true
        plane.position.x = 0;
        plane.position.y = 4.6;
        plane.position.z = 0;

        console.log(this.uniforms);


        this.dat.add(plane.position,"y",0,10);

        //添加地板容器
        this.scene.add(plane);

    }
    addLight(){

        //创建聚光灯
        const light = new SpotLight("#fff",2500);
        light.castShadow = true;            // default false
        light.position.x = 10;
        light.position.y = 20;
        light.position.z = 20;



        //创建聚光灯
        const light1 = new SpotLight("#fff",500);
        light1.castShadow = true;            // default false
        light1.position.x = -10;
        light1.position.y = 20;
        light1.position.z = -20;

        this.scene.add(light);
        this.scene.add(light1);
        // this.scene.add(new SpotLightHelper(light));
        // this.scene.add(new SpotLightHelper(light1));
    }
    init() {
        this.clock.start();
        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.renderer.shadowMap.type = PCFSoftShadowMap;
        this.control.enableDamping=true;
        this.control.dampingFactor = 0.08;
        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 12, 12);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

    }
    animate(){

        if(this.uniforms){
            this.uniforms.uTime.value=this.clock.getElapsedTime();
        }

        this.control.update()
        this.stats.update()
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }
}