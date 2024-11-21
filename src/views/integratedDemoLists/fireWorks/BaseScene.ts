import {
    ACESFilmicToneMapping, AdditiveBlending, BufferAttribute, BufferGeometry, Color,
    DoubleSide, Float32BufferAttribute,
    Mesh, MeshBasicMaterial,
    MeshLambertMaterial,
    PlaneGeometry, Points, PointsMaterial, ShaderChunk, ShaderMaterial, Spherical,
    SpotLight, SpriteMaterial, Texture, TextureLoader, Uniform, Vector3
} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import {gsap} from "gsap";
import vertex from "./vertex.glsl"
import fragment from "./fragment.glsl"
import * as THREE from "three";
import p1 from "@/views/integratedDemoLists/fireWorks/partice/p (1).png"
import p2 from "@/views/integratedDemoLists/fireWorks/partice/p (2).png"
import p3 from "@/views/integratedDemoLists/fireWorks/partice/p (3).png"
import p4 from "@/views/integratedDemoLists/fireWorks/partice/p (4).png"
import p5 from "@/views/integratedDemoLists/fireWorks/partice/p (5).png"
import p6 from "@/views/integratedDemoLists/fireWorks/partice/p (6).png"
import p7 from "@/views/integratedDemoLists/fireWorks/partice/p (7).png"
import p8 from "@/views/integratedDemoLists/fireWorks/partice/p (8).png"
import sr from "@/assets/img/sr.png"
import {SkyScene} from "@/views/integratedDemoLists/SketchBoxControl/core/Sky/SkyScene";

// 生成随机烟花颜色的函数
function getRandomFireworkColor() {
    // 随机生成色相 (hue) 范围 0-360
    const hue = Math.random() * 360;

    // 设置高饱和度，确保颜色鲜艳（80% 到 100%）
    const saturation = 80 + Math.random() * 20;

    // 设置适中的亮度，避免过亮或过暗（50% 到 70%）
    const lightness = 50 + Math.random() * 20;

    // 使用 HSL 创建颜色
    const color = new THREE.Color();
    color.setHSL(hue / 360, saturation / 100, lightness / 100);

    return color;
}

export class BaseScene extends BaseInit {
    private m: ShaderMaterial;

    plane:Mesh;

    private textures:Texture[]
    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            transparentRenderBg:true,
            needAxesHelper:false,
            adjustScreenSize:true,
            renderDomId:"#renderDom"
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.loadTexture();


        this.addLight();
        // this.addPlan();
        this.renderer.toneMappingExposure=0.2;
        let ins=new SkyScene(this);

        this.addDebug()
        this.animate()
    }
    addDebug(){
        this.dat.add(this,"addSomeThing").name("fire")
    }
    randomCreate(){

        for (let i=0;i<10;i++){
            let count=1000+Math.random()*500;
            let half=10;
            let center=new Vector3(Math.random()*half*2-half,Math.random()*half*2-half,Math.random()*half*2-half);

            // 随机一个下标
            const randomIndex = Math.floor(Math.random() * this.textures.length);
            this.createFireWork(count,center,randomIndex,3.2+Math.random(),getRandomFireworkColor());
        }
    }
    addSomeThing(){

        this.createFireWork(2000,new Vector3(1,2,0),7,4,new Color("#f0648e"));
        // this.createFireWork(1000,new Vector3(0,6,0),4,1,new Color("#f00"));
    }
    loadTexture(){
        let loader=new TextureLoader();

        this.textures=[
            loader.load(p1),
            loader.load(p2),
            loader.load(p3),
            loader.load(p4),
            loader.load(p5),
            loader.load(p6),
            loader.load(p7),
            loader.load(p8)
        ]
    }
    extraOnReSize() {
        console.log("aaa",this.screenSize)
        console.log(this.m?.uniforms)
    }

    createFireWork(
        count:number,
        center:Vector3,
        index:number,
        sphereSize:number=1,
        color:Color,
        size:number=10,
    ){
        let position=new Float32Array(count*3);
        let origin=new Float32Array(count*3);
        let sizeArr=new Float32Array(count);
        let timeScaleArr=new Float32Array(count);

        for(let i=0;i<count;i++){

            let p=i*3;


            const spherical=new Spherical(
                sphereSize * (0.75 + Math.random()*0.25),
                Math.acos(1 - 2 * Math.random()),
                Math.random()*Math.PI*2
            );

            let c=new Vector3();
            c.setFromSpherical(spherical);

            origin[p]=center.x;
            origin[p+1]=center.y;
            origin[p+2]=center.z;

            position[p]=c.x;
            position[p+1]=c.y;
            position[p+2]=c.z;

            sizeArr[i]=Math.random();
            timeScaleArr[i]=1+Math.random();
        }
        const geometry = new BufferGeometry();

        geometry.setAttribute('origin', new Float32BufferAttribute(origin, 3));
        geometry.setAttribute('position', new Float32BufferAttribute(position, 3));
        geometry.setAttribute('rSize', new Float32BufferAttribute(sizeArr, 1));
        geometry.setAttribute('rTimeScale', new Float32BufferAttribute(timeScaleArr, 1));

        console.log(position);

        console.log(geometry);


        let v=vertex.replace("///logdepthbuf_pars_vertex",ShaderChunk.logdepthbuf_pars_vertex)
        v=v.replace("///logdepthbuf_vertex",ShaderChunk.logdepthbuf_vertex)

        let f=fragment.replace("///logdepthbuf_pars_fragment",ShaderChunk.logdepthbuf_pars_fragment)
        f=f.replace("///logdepthbuf_fragment",ShaderChunk.logdepthbuf_fragment)

        let texture=this.textures[index];
        texture.flipY=false;

        const material = new ShaderMaterial({
            vertexShader:v,
            fragmentShader:f,
            uniforms:{
                uSize:new Uniform(size),
                uResolution:new Uniform(this.screenSize),
                uTexture:new Uniform(texture),
                uColor:new Uniform(color),
                uProgress:new Uniform(0)
            },

            depthTest:true,
            depthWrite: false,     // 禁止透明部分写入深度缓冲区
            blending:AdditiveBlending,
            transparent:true
        });

        
        const fireWorks=new Points(geometry,material);
        fireWorks.position.copy(center)
        this.scene.add(fireWorks);

        const destroy=()=>{
            this.scene.remove(fireWorks)
            geometry.dispose()
            material.dispose()
        }

        gsap.to(material.uniforms.uProgress,{
            value:1,
            duration:2,
            ease:"none",
            onComplete:()=>{
                destroy()
            }
        })

    }
    addPlan(){

        const geometry = new PlaneGeometry(0.5, 0.5);


        const material = new MeshBasicMaterial({color:new Color("#e0ea34")});
        material.side=DoubleSide
        const plane = new Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true

        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        this.plane=plane;
        //添加地板容器
        this.scene.add(plane);

        this.dat.add(this,"scalePlan").name("scale")
    }
    scalePlan(){
        let s={value:1}
        gsap.to(s,{
            value:2,
            duration:2,
            ease:"bounce",
            onUpdate:()=>{
                this.plane.scale.set(s.value,s.value,s.value)
            },
            onComplete:()=>{
            }
        })
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

        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.9;
        this.control.enableDamping=true;
        this.control.dampingFactor = 0.08;
        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 0, -40);
        //定位相机指向场景中心
        this.camera.lookAt(new Vector3(0,0,0))


        // const axesHelper = new THREE.AxesHelper(4);
        // this.scene.add(axesHelper);

    }
    animate(){

        try{
            this.control.update()
            this.stats.update()
            this.renderer.render(this.scene, this.camera);
            this.raf=requestAnimationFrame(this.animate.bind(this));
        }catch (e) {

        }
    }
}