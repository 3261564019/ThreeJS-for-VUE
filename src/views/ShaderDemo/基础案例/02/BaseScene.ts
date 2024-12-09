import {
    ACESFilmicToneMapping,
    AxesHelper,
    BufferAttribute,
    Clock,
    DoubleSide,
    Mesh,
    Object3D,
    PlaneGeometry,
    ShaderMaterial,
    SpotLight,
    TextureLoader
} from "three";

import v from "./vertex.glsl?raw"
import f from "./fragment.glsl?raw"
import homer from "@/assets/img/cubeImg/5.png"
// import plan from "@/assets/model/plan.glb?url"
import opacity from "@/assets/img/opcatity.png"
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export class BaseScene extends BaseInit {

    material:ShaderMaterial
    private clock:Clock;


    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            needAxesHelper:true,
            renderDomId:"#shaderRoot",
            transparentRenderBg:true
        } as BaseInitParams);

        // this.initDebug();

        this.init();

        this.createMaterial()
        this.addPlan();
        // this.addModel()

        this.addLight();

        let t=new Object3D()
        t.position.set(0,0,20)
        t.add(new AxesHelper(2))

        this.scene.add(t)

        this.animate()
    }
    createMaterial(){
        let texture=new TextureLoader().load(homer)
        let textureOpacity=new TextureLoader().load(opacity)
        this.material=new ShaderMaterial({
            vertexShader:v,
            fragmentShader:f,
            uniforms: {
                //主要贴图
                uTextureMain: { value: texture }, // 将纹理传入 shader
                uTextureOpacity: { value: textureOpacity }, // 将纹理传入 shader
                uTime: { value: 0 }, // 将纹理传入 shader
            },
            transparent:true,
            wireframe:false,
            depthTest:true
        })
    }
    addModel(){
        let loader = new GLTFLoader()
        // loader.load(plan,(e)=>{
        //     let m:Mesh=e.scene.getObjectByName("平面") as Mesh;
        //     m.material=this.material
        //     console.log(m)
        //     this.scene.add(m)
        // })
    }
    addPlan(){

        const geometry = new PlaneGeometry(40, 40,80,80);
        //拿到顶点的数量
        let pointSize=geometry.attributes.position.count;
        //创建好数组
        let data=new Float32Array(pointSize);
        for(let i = 0; i<pointSize;i++){
            data[i]=Math.random()
        }
        //设置到attribute
        geometry.setAttribute("APointRandom", new BufferAttribute(data, 1));


        console.log("planGeometry",geometry)
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