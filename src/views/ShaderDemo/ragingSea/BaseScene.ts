import {
    ACESFilmicToneMapping,
    AxesHelper,
    Clock,
    Color,
    DoubleSide, FrontSide,
    Mesh, MeshBasicMaterial,
    PlaneGeometry,
    ShaderMaterial, SphereGeometry, Uniform,
    Vector2
} from "three";

import v from "./vertex.glsl"
import f from "./fragment.glsl"
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import plan from "@/assets/model/plan.glb?url";

export class BaseScene extends BaseInit {

    material:ShaderMaterial
    plan:Mesh;
    private clock:Clock;

    debugData={
        //整体倍率
        uBigWave:3.2,
        //频率的速度
        uFrequency:new Vector2(0.16,0.08),
        uSpeed:1,
        uHeightColor:"#fff",
        uDepthColor:"#807efc",
        uDirectionLightColor:"#ffffff",
        uMixMultiple:0.08,
        uOffset:0.5,
        //噪波的速度
        uNoiseSpeed:0.7,
        //噪波图案的大小
        uNoiseScale:7.1,
        //噪波数据的强度
        uNoiseStrength:1,
        //高光程度
        uSpecular:0.06,

        uDirectionLightStrength:0.1,
        uPointLightStrength:1.2,


        pointColor:"#ffcd1f",
        shiftOffset:0.1,
    }

    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            adjustScreenSize:true,
            needAxesHelper:false,
            renderDomId:"#shaderRoot",
            transparentRenderBg:true
        } as BaseInitParams);

        this.initDebug();

        this.init();
        this.createMaterial()
        this.addDebug();
        this.addPlan();
        this.animate()
        this.addHelper();
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
                uDirectionLightStrength:{value:this.debugData.uDirectionLightStrength},
                uPointLightStrength:{value:this.debugData.uPointLightStrength},
                uHeightColor:{value:new Color(this.debugData.uHeightColor)},
                uDepthColor:{value:new Color(this.debugData.uDepthColor)},
                uDirectionLightColor:{value:new Color(this.debugData.uDirectionLightColor)},
                uMixMultiple:{value:this.debugData.uMixMultiple},
                uOffset:{value:this.debugData.uOffset},
                uPointLightColor:new Uniform(new Color(this.debugData.pointColor)),
                uNoiseSpeed:{value:this.debugData.uNoiseSpeed},
                uNoiseScale:{value:this.debugData.uNoiseScale},
                uNoiseStrength:{value:this.debugData.uNoiseStrength},
                uSpecular:{value:this.debugData.uSpecular},
                uShiftOffset:{value:this.debugData.shiftOffset},
            },
            transparent:true,
            wireframe:false,
            depthTest:true,
            side:FrontSide
        })


    }
    addHelper(){
        let addDirectionHelper=()=>{
            const geometry = new PlaneGeometry(2, 2);
            const m=new MeshBasicMaterial({color:new Color("#ccc")})
            m.side=DoubleSide

            const plane = new Mesh(geometry, m);
            plane.position.set(0,10,0)
            plane.lookAt(0,0,0)
            this.scene.add(plane);
        }

        let addPointLightHelper1=()=>{
            const geometry = new SphereGeometry(0.5, 32,32);
            const m=new MeshBasicMaterial({color:"#fff"})
            m.side=DoubleSide
            const plane = new Mesh(geometry, m);
            plane.position.set(-8,6,3)
            plane.lookAt(0,0,0)
            this.scene.add(plane);
        }
        let addPointLightHelper2=()=>{
            const geometry = new SphereGeometry(0.5, 32,32);
            const m=new MeshBasicMaterial({color:"#fff"})
            m.side=DoubleSide
            const plane = new Mesh(geometry, m);
            plane.position.set(8,6,-8)

            plane.lookAt(0,0,0)
            this.scene.add(plane);
        }

        addDirectionHelper()
        addPointLightHelper1()
        addPointLightHelper2()
    }
    addDebug(){
        this.dat.add(this.debugData,"uBigWave",-30,30,0.1).name("uBigWave").onChange((e:number)=>{
            this.material.uniforms.uBigWave.value=e;
        })
        this.dat.add(this.debugData.uFrequency,"x",-0.5,0.5,0.01).name("uFrequency--X").onChange((e:number)=>{
            this.material.uniforms.uFrequency.value.x=e;
        })
        this.dat.add(this.debugData.uFrequency,"y",-0.5,0.5,0.01).name("uFrequency--Y").onChange((e:number)=>{
            this.material.uniforms.uFrequency.value.y=e;
        })
        this.dat.add(this.debugData,"uSpeed",0,3,0.1).name("uSpeed").onChange((e:number)=>{
            this.material.uniforms.uSpeed.value=e;
        })
        this.dat.addColor(this.debugData,"pointColor").onChange(
            ()=>{
                this.material.uniforms.uPointLightColor.value.set(this.debugData.pointColor);
            }
        ).name("点光源颜色");
        this.dat.addColor(this.debugData,"uDirectionLightColor").onChange(
            ()=>{
                this.material.uniforms.uDirectionLightColor.value.set(this.debugData.uDirectionLightColor);
            }
        ).name("方向灯颜色");
        this.dat.add(this.debugData,"uDirectionLightStrength",0,3,0.1).name("uDirectionLightStrength").onChange((e:number)=>{
            this.material.uniforms.uDirectionLightStrength.value=e;
        }).name("方向灯强度")
        this.dat.add(this.debugData,"uPointLightStrength",0,10,0.1).name("uPointLightStrength").onChange((e:number)=>{
            this.material.uniforms.uPointLightStrength.value=e;
        }).name("点光源强度")
        this.dat.add(this.debugData,"shiftOffset",0,1,0.001).name("shiftOffset").onChange((e:number)=>{
            this.material.uniforms.uShiftOffset.value=e;
        })
        this.dat.addColor(this.debugData,"uHeightColor").onChange(()=>{
            console.log("颜色",this.debugData.uHeightColor)
            this.material.uniforms.uHeightColor.value.set(this.debugData.uHeightColor)
        })
        this.dat.addColor(this.debugData,"uDepthColor").onChange(()=>{
            console.log("11111111",this.debugData.uDepthColor)
            this.material.uniforms.uDepthColor.value.set(this.debugData.uDepthColor)
        })
        this.dat.add(this.debugData,"uMixMultiple",0,1,0.01).onChange((e:number)=>{
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
        this.dat.add(this.debugData,"uSpecular",0,1,0.001).onChange((e:number)=>{
            this.material.uniforms.uSpecular.value=e;
        }).name("高光程度")
    }
    addPlan(){

        const geometry = new PlaneGeometry(40, 40,512,512);
        geometry.rotateX(-Math.PI/2)

        const material = this.material
        geometry.deleteAttribute("normal")
        const plane = new Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;
        // this.scene.add(new AxesHelper(10))

        this.plan=plane;
        console.log(plane)
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
        // this.plan.position.y=Math.sin(this.clock.getElapsedTime())*20.0
        // this.plan.geometry.computeVertexNormals();
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }
}