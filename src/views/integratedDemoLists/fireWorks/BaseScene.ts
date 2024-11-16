import {
    ACESFilmicToneMapping, AdditiveBlending, BufferAttribute, BufferGeometry,
    DoubleSide, Float32BufferAttribute,
    Mesh,
    MeshLambertMaterial,
    PlaneGeometry, Points, PointsMaterial, ShaderChunk, ShaderMaterial,
    SpotLight, SpriteMaterial, Texture, TextureLoader, Uniform, Vector3
} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
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

export class BaseScene extends BaseInit {
    private m: ShaderMaterial;

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

        this.addPlan();

        this.addLight();

        this.createFireWork(100,new Vector3(0,0,0),7);

        this.animate()
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

    createFireWork(count:number,center:Vector3,index:number,size:number=10){
        let position=new Float32Array(count*3);

        let radius=1;
        for(let i=0;i<count;i++){

            let p=i*3;

            position[p]=center.x+ Math.random()*radius-(radius/2);
            position[p+1]=center.y+ Math.random()*radius-(radius/2);
            position[p+2]=center.z+ Math.random()*radius-(radius/2);
        }
        const geometry = new BufferGeometry();

        geometry.setAttribute('position', new Float32BufferAttribute(position, 3));

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
            },

            depthTest:true,
            depthWrite: false,     // 禁止透明部分写入深度缓冲区
            blending:AdditiveBlending,


            transparent:true
        });

        this.m=material;
        
        const fireWorks=new Points(geometry,material);

        this.scene.add(fireWorks);
    }
    addPlan(){

        const geometry = new PlaneGeometry(1, 1);
        const material = new MeshLambertMaterial({color: 0x222222});
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

        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.9;
        this.control.enableDamping=true;
        this.control.dampingFactor = 0.08;
        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 0, 3);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)


        const axesHelper = new THREE.AxesHelper(1);
        this.scene.add(axesHelper);

    }
    animate(){

        this.control.update()
        this.stats.update()
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }
}