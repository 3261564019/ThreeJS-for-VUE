import {
    ACESFilmicToneMapping,
    AxesHelper, BackSide,
    Clock, Color,
    DoubleSide, FrontSide, MathUtils,
    Mesh, MeshBasicMaterial,
    PlaneGeometry, ShaderChunk,
    ShaderMaterial,
    SphereGeometry, Spherical, SRGBColorSpace, Uniform
} from "three";

import vertex from "./vertex.glsl"
import fragment from "./fragment.glsl"
import oVertex from "./outSphere/vertex.glsl"
import oFragment from "./outSphere/fragment.glsl"


import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import daymap from "@/assets/texture/earth/8k_earth_daymap.jpg?url"
import nightmap from "@/assets/texture/earth/8k_earth_nightmap.jpg?url"
import clouds from "@/assets/texture/earth/8k_earth_clouds.jpg?url"
import specularjpg from "@/assets/texture/earth/8k_earth_specular_map.jpg?url"

export class BaseScene extends BaseInit {

    material:ShaderMaterial
    outMaterial:ShaderMaterial

    private clock:Clock;
    spherical=new Spherical(4,1.2,Math.PI/2);
    pointLight:Mesh;

    cloudSize=0.15;

    colorCenter="#00aaff"
    colorSide="#ff6600"

    a=0.52;
    b=0;
    c=1;

    outSideStep=0.277
    outSidePow=4
    uOutSideTransPow=1.72

    uColorPow=6;
    uSpecular=20;
    addDebug(){

        console.log("aaa", this.renderer.capabilities.getMaxAnisotropy())
        this.lightPositionChange()

        this.dat.add(this.spherical,"radius",2,4,0.01).name("radius").onChange(()=>{
            this.lightPositionChange()
        })
        this.dat.add(this.spherical,"phi",0,Math.PI*2,0.01).name("灯光仰角").onChange(()=>{
            this.lightPositionChange()
        })
        this.dat.add(this.spherical,"theta",0,Math.PI*2,0.01).name("灯光水平角").onChange(()=>{
            this.lightPositionChange()
        })

        this.dat.add(this,"cloudSize",0,0.9).name("云朵密度").onChange(()=>{
            // this.lightPositionChange()
            this.material.uniforms.uCloudSize.value=this.cloudSize;
        })
        this.dat.addColor(this,"colorCenter").name("中间颜色").onChange(
            ()=>{
                this.material.uniforms.uColorCenter.value.set(this.colorCenter);
                this.outMaterial.uniforms.uColorCenter.value.set(this.colorCenter);
            }
        )
        this.dat.addColor(this,"colorSide").name("周边颜色").onChange(
            ()=>{
                this.material.uniforms.uColorSide.value.set(this.colorSide);
                this.outMaterial.uniforms.uColorSide.value.set(this.colorSide);

            }
        )

        this.dat.add(this,"a",-2,2,0.01).name("a").onChange(()=>{
            // this.lightPositionChange()
            this.material.uniforms.uA.value=this.a;
        })
        this.dat.add(this,"b",-2,2,0.01).name("b").onChange(()=>{
            // this.lightPositionChange()
            this.material.uniforms.uB.value=this.b;
        })
        this.dat.add(this,"c",-2,2,0.01).name("c").onChange(()=>{
            // this.lightPositionChange()
            this.material.uniforms.uC.value=this.c;
        })

        this.dat.add(this,"uColorPow",-20,40,0.01).name("uColorPow").onChange(()=>{
            // this.lightPositionChange()
            this.material.uniforms.uColorPow.value=this.uColorPow;
        })
        this.dat.add(this,"uSpecular",-20,40,0.01).name("uSpecular").onChange(()=>{
            // this.lightPositionChange()
            this.material.uniforms.uSpecularPow.value=this.uSpecular;
        })
    }
    lightPositionChange(){
        let spherical=this.spherical;
        // 转换为笛卡尔坐标
        const x = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
        const y = spherical.radius * Math.cos(spherical.phi);
        const z = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
        this.pointLight.position.set(x,y,z);
        this.material.uniforms.uLightPosition.value=this.pointLight.position;
    }
    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            needAxesHelper:false,
            needTextureLoader:true,
            renderDomId:"#shaderRoot",
            transparentRenderBg:true
        } as BaseInitParams);

        this.initDebug();


        // console.log()
        this.init();
        this.addHelper();

        this.createMaterial()
        this.createOutMaterial()
        this.allBall();
        this.addOutBall();
        this.addDebug()

        this.animate()
    }
    createOutMaterial(){
        let v=oVertex.replace("///logdepthbuf_pars_vertex",ShaderChunk.logdepthbuf_pars_vertex)
        v=v.replace("///logdepthbuf_vertex",ShaderChunk.logdepthbuf_vertex)

        let f=oFragment.replace("///logdepthbuf_pars_fragment",ShaderChunk.logdepthbuf_pars_fragment)
        f=f.replace("///logdepthbuf_fragment",ShaderChunk.logdepthbuf_fragment)


        this.outMaterial=new ShaderMaterial({
            vertexShader:v,
            fragmentShader:f,
            side:FrontSide,
            transparent:true,
            uniforms: {
                uLightPosition: { value: this.pointLight.position },  // 直接使用Vector3
                uA: { value: this.a },  // 假设a是一个数值
                uB: { value: this.b },  // 假设b是一个数值
                uOutSideStep: { value: this.outSideStep },
                uOutSidePow: { value: this.outSidePow },
                uOutSideTransPow: { value: this.uOutSideTransPow },
                uColorSide: { value: new Color(this.colorSide) },  // Color类型没问题
                uColorCenter: { value: new Color(this.colorCenter) }  // Color类型没问题
            }
        });

        this.dat.add(this,"outSideStep",0,1,0.001).name("outSideStep").onChange(()=>{
            // this.lightPositionChange()
            this.outMaterial.uniforms.uOutSideStep.value=this.outSideStep;
        })
        this.dat.add(this,"outSidePow",-10,10,0.01).name("outSidePow").onChange(()=>{
            // this.lightPositionChange()
            this.outMaterial.uniforms.uOutSidePow.value=this.outSidePow;
        })
        this.dat.add(this,"uOutSideTransPow",-10,20,0.01).name("uOutSideTransPow").onChange(()=>{
            // this.lightPositionChange()
            this.outMaterial.uniforms.uOutSideTransPow.value=this.uOutSideTransPow;
        })
    }
    createMaterial(){

        let daymapT=this.textureLoader.load(daymap)
        daymapT.colorSpace=SRGBColorSpace
        daymapT.anisotropy=8;
        let nightmapT=this.textureLoader.load(nightmap)
        nightmapT.colorSpace=SRGBColorSpace
        nightmapT.anisotropy=8;
        let cloudsT=this.textureLoader.load(clouds)
        cloudsT.colorSpace=SRGBColorSpace
        cloudsT.anisotropy=8;
        let specularT=this.textureLoader.load(specularjpg)
        specularT.anisotropy=8;
        let v=vertex.replace("///logdepthbuf_pars_vertex",ShaderChunk.logdepthbuf_pars_vertex)
        v=v.replace("///logdepthbuf_vertex",ShaderChunk.logdepthbuf_vertex)

        let f=fragment.replace("///logdepthbuf_pars_fragment",ShaderChunk.logdepthbuf_pars_fragment)
        f=f.replace("///logdepthbuf_fragment",ShaderChunk.logdepthbuf_fragment)

        this.material=new ShaderMaterial({
            vertexShader:v,
            fragmentShader:f,
            uniforms: {
                uTime: { value: 0 }, // 将纹理传入 shader
                uDay:new Uniform(daymapT),
                uNight: { value: nightmapT },
                uClouds: { value: cloudsT },
                uSpecular: { value: specularT },
                uA:{value:this.a},
                uB:{value:this.b},
                uC:{value:this.c},
                uColorPow:{value:this.uColorPow},
                uSpecularPow:{value:this.uSpecular},
                uCloudSize: { value: this.cloudSize },
                uColorSide: { value: new Color(this.colorSide) },
                uColorCenter: { value: new Color(this.colorCenter) },
                uLightPosition: { value: new Uniform(this.pointLight.position) },
            },
            transparent:true,
            wireframe:false,
            side:FrontSide,
            depthWrite:false
        })
        this.material.uniforms.uCloudSize.value=this.cloudSize;

    }
    addHelper(){


        let addPointLightHelper1=()=>{
            const geometry = new SphereGeometry(0.2, 32,32);
            const m=new MeshBasicMaterial({color:"#fff"})
            m.side=DoubleSide
            const plane = new Mesh(geometry, m);
            plane.position.set(0,0,4)
            plane.lookAt(0,0,0)

            this.pointLight=plane;
            this.scene.add(plane);
        }


        addPointLightHelper1()
    }
    addOutBall(){
        const geometry = new SphereGeometry(2, 64,64);
        const m=new Mesh(geometry,this.outMaterial)
        let s=1.04;
        m.scale.set(s,s,s);
        this.scene.add(m)
        // window.b=m;
    }
    allBall(){


        const geometry = new SphereGeometry(2, 64,64);
        const material = this.material
        // material.side=DoubleSide
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
        this.clock.start();
        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.control.enableDamping=true;
        this.control.dampingFactor = 0.08;
        this.renderer.shadowMap.enabled = true;

        // this.scene.add(new AxesHelper(4));

        this.camera.position.set(0, 0, 8);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)
    }
    animate(){



        // this.material.uniforms.uTime.value=this.clock.getElapsedTime();
        this.control.update()
        this.stats.update()
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }
}