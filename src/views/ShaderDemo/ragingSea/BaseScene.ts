import {ACESFilmicToneMapping, Clock, Color, DoubleSide, Mesh, PlaneGeometry, ShaderMaterial, Vector2} from "three";

import v from "./vertex.glsl?raw"
import f from "./fragment.glsl?raw"
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import plan from "@/assets/model/plan.glb?url";

export class BaseScene extends BaseInit {

    material:ShaderMaterial
    private clock:Clock;

    debugData={
        //整体倍率
        uBigWave:1,
        //频率的速度
        uFrequency:new Vector2(7,10),
        uSpeed:1,
        uHeightColor:"#9bd8ff",
        uDepthColor:"#186691",
        uMixMultiple:0.5,
        uOffset:0.7,
        //噪波的速度
        uNoiseSpeed:0.7,
        //噪波图案的大小
        uNoiseScale:15,
        //噪波数据的强度
        uNoiseStrength:1
    }

    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            adjustScreenSize:true,
            needAxesHelper:true,
            renderDomId:"#shaderRoot",
            transparentRenderBg:true
        } as BaseInitParams);

        this.initDebug();

        this.init();
        this.createMaterial()
        this.addDebug();
        this.addPlan();
        this.animate()
    }
    createMaterial(){
        this.material=new ShaderMaterial({
            vertexShader:v,
            fragmentShader:f,
            uniforms: {
                uTime: { value: 0 }, // 将纹理传入 shader,
                uSpeed: { value: this.debugData.uSpeed }, // 将纹理传入 shader,
                uBigWave:{value:this.debugData.uBigWave},
                uFrequency:{value:this.debugData.uFrequency},
                uHeightColor:{value:new Color(this.debugData.uHeightColor)},
                uDepthColor:{value:new Color(this.debugData.uDepthColor)},
                uMixMultiple:{value:this.debugData.uMixMultiple},
                uOffset:{value:this.debugData.uOffset},
                uNoiseSpeed:{value:this.debugData.uNoiseSpeed},
                uNoiseScale:{value:this.debugData.uNoiseScale},
                uNoiseStrength:{value:this.debugData.uNoiseStrength},
            },
            transparent:true,
            wireframe:false,
            depthTest:true
        })


    }
    addDebug(){
        this.dat.add(this.debugData,"uBigWave",-30,30,0.1).name("uBigWave").onChange((e:number)=>{
            this.material.uniforms.uBigWave.value=e;
        })
        this.dat.add(this.debugData.uFrequency,"x",-300,300,0.1).name("uFrequency--X").onChange((e:number)=>{
            this.material.uniforms.uFrequency.value.x=e;
        })
        this.dat.add(this.debugData.uFrequency,"y",-300,300,0.1).name("uFrequency--Y").onChange((e:number)=>{
            this.material.uniforms.uFrequency.value.y=e;
        })
        this.dat.add(this.debugData,"uSpeed",0,3,0.1).name("uSpeed").onChange((e:number)=>{
            this.material.uniforms.uSpeed.value=e;
        })
        this.dat.addColor(this.debugData,"uHeightColor").onChange(()=>{
            console.log("颜色",this.debugData.uHeightColor)
            this.material.uniforms.uHeightColor.value.set(this.debugData.uHeightColor)
        })
        this.dat.addColor(this.debugData,"uDepthColor").onChange(()=>{
            console.log("11111111",this.debugData.uDepthColor)
            this.material.uniforms.uDepthColor.value.set(this.debugData.uDepthColor)
        })
        this.dat.add(this.debugData,"uMixMultiple",0,5,0.1).onChange((e:number)=>{
            this.material.uniforms.uMixMultiple.value=e;
        })
        this.dat.add(this.debugData,"uOffset",0,5,0.1).onChange((e:number)=>{
            this.material.uniforms.uOffset.value=e;
        })
        this.dat.add(this.debugData,"uNoiseSpeed",0,5,0.1).onChange((e:number)=>{
            this.material.uniforms.uNoiseSpeed.value=e;
        })
        this.dat.add(this.debugData,"uNoiseScale",0,50,0.1).onChange((e:number)=>{
            this.material.uniforms.uNoiseScale.value=e;
        })
        this.dat.add(this.debugData,"uNoiseStrength",0,10,0.1).onChange((e:number)=>{
            this.material.uniforms.uNoiseStrength.value=e;
        })
    }
    addPlan(){

        const geometry = new PlaneGeometry(40, 40,512,512);
        geometry.rotateX(Math.PI/2)
        const material = this.material
        material.side=DoubleSide
        const plane = new Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true
        plane.position.x = 0;
        plane.position.y = 2;
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
        this.camera.position.set(30, 30, 30);
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