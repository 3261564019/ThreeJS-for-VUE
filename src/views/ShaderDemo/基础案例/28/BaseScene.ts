import {
    ACESFilmicToneMapping,
    Clock, Color,
    DoubleSide, LinearFilter,
    Mesh,
    PlaneGeometry,
    RGBFormat,
    ShaderMaterial,
    VideoTexture
} from "three";

import v from "./vertex.glsl?raw"
import f from "./fragment.glsl?raw"
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";

export class BaseScene extends BaseInit {

    material:ShaderMaterial
    private clock:Clock;

    debugData={
        tolerance:0.15,
        smoothness:0.08
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
        this.createMaterial()
        this.addPlan();
        this.animate()
    }
    createMaterial(){


        const video = document.getElementById( 'tempVideo' );
        const videoTexture = new VideoTexture( <HTMLVideoElement>video );

        videoTexture.minFilter = LinearFilter;
        videoTexture.magFilter = LinearFilter;
        // videoTexture.format = RGBFormat;


        this.material=new ShaderMaterial({
            vertexShader:v,
            fragmentShader:f,
            uniforms: {
                uTime: { value: 0 }, // 将纹理传入 shader
                keyColor: { value: new Color(0x000000) }, // 黑色作为透明颜色
                videoTexture: { value: videoTexture },

                tolerance: { value: this.debugData.tolerance },
                smoothness: { value: this.debugData.smoothness },
            },
            transparent:true,
            wireframe:false,
            depthTest:true
        })
        this.dat.add(this.debugData,"tolerance",0,1).step(0.0001).name("容差值").onChange((e:Number)=>{
            this.material.uniforms.tolerance.value = e;
        });
        this.dat.add(this.debugData,"smoothness",0,1).step(0.0001).name("平滑度").onChange((e:Number)=>{
            this.material.uniforms.smoothness.value = e;
        });
    }
    addPlan(){

        const geometry = new PlaneGeometry(40, 40,80,80);
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