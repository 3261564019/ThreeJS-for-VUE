import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import {
    ACESFilmicToneMapping, ClampToEdgeWrapping, Clock,
    DoubleSide, Mesh,
    MeshLambertMaterial, MeshPhysicalMaterial,
    PlaneGeometry, RepeatWrapping, ShaderMaterial,
    SphereGeometry,
    SpotLight, Texture, TextureLoader
} from "three";

import v from "./vertex.glsl?raw"
import f from "./fragment.glsl?raw"
import wall from "@/assets/img/wall/wall.png"
import track from "@/assets/img/wall/track.png"

export class BaseScene extends BaseInit {

    materials:ShaderMaterial[]=[]
    private material: ShaderMaterial;
    private clock: Clock;
    public videoRateChange:(num:number)=>void;

    debugData={
        rate:0.5,
        fade:0.03,
        scale:1,
        //对比度
        contrast:1.4,
        videoRate:0.1,
    }

    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            needAxesHelper:true,
            renderDomId:"#shaderRoot",
            transparentRenderBg:true
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.createMaterial();
        this.addPlan();
        this.addLight();
        this.animate()
    }
    createMaterial(){
        let wallT=new TextureLoader().load(wall)
        let trackT=new TextureLoader().load(track)
        trackT.wrapS = RepeatWrapping;
        trackT.wrapT = RepeatWrapping;
        this.material=new ShaderMaterial({
            vertexShader:v,
            fragmentShader:f,
            uniforms: {
                uRate:{value:this.debugData.rate},
                uScale:{value:this.debugData.scale},
                uFade:{value:this.debugData.fade},
                uContrast:{value:this.debugData.contrast},
                uTime: { value: 0 }, // 将纹理传入 shader,
                //主要贴图
                uTextureWall: { value: wallT }, // 将纹理传入 shader
                uTextureTrack: { value: trackT }, // 将纹理传入 shader
            },
            transparent:true
        })

        this.dat.add(this.debugData,"rate",0,1).name("裂缝位置").onChange((e:Number)=>{
            this.material.uniforms.uRate.value = e;
        });
        this.dat.add(this.debugData,"fade",0.01,0.5).name("过渡倍率").onChange((e:Number)=>{
            this.material.uniforms.uFade.value = e;
        });
        this.dat.add(this.debugData,"scale",0,4).name("裂缝增强").onChange((e:Number)=>{
            this.material.uniforms.uScale.value = e;
        });
        this.dat.add(this.debugData,"contrast",0,5).name("裂缝对比度").onChange((e:Number)=>{
            this.material.uniforms.uContrast.value = e;
        });

        this.dat.add(this.debugData,"videoRate",0,1).name("视频进度").onChange((e:number)=>{
            // this.material.uniforms.uContrast.value = e;
            this.videoRateChange(e)
        });
    }
    setTrack(t:Texture){
        this.material.uniforms.uTextureTrack.value = t;
    }
    addPlan(){

        const geometry = new PlaneGeometry(40, 40);
        const material = this.material
        material.side=DoubleSide
        const plane = new Mesh(geometry, material);
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
        const light = new SpotLight("#fff");
        light.castShadow = true;            // default false
        light.position.x = 20;
        light.position.y = 30;

        this.scene.add(light);
    }
    init() {
        this.clock=new Clock();
        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.9;
        this.control.enableDamping=true;
        this.control.dampingFactor = 0.08;
        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 0, 60);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

    }
    animate(){
        this.material.uniforms.uTime.value=this.clock.getElapsedTime();
        this.control.update()
        this.stats.update()
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }
}