import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import {
    ACESFilmicToneMapping,
    DoubleSide, LinearEncoding,
    Mesh,
    MeshLambertMaterial, MeshPhysicalMaterial,
    PlaneGeometry, ShaderMaterial,
    SphereGeometry,
    SpotLight, TextureLoader, Vector3
} from "three";

import v from "./vertex.glsl?raw"
import f from "./fragment.glsl?raw"
import homer from "@/assets/img/cubeImg/5.png"
import opcatity from "@/assets/img/opcatity.png"
export class BaseScene extends BaseInit {

    materials:ShaderMaterial[]=[]


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

        this.addLight();

        var a = new Vector3(1, 0, 0);
        var b = new Vector3(0, 0, 1);
        var crossProduct = new Vector3().crossVectors(b, a);

        console.log("crossProduct",crossProduct)

        this.animate()
    }
    createMaterial(){
        let texture=new TextureLoader().load(homer)
        let textureOpacity=new TextureLoader().load(opcatity)
        this.materials.push(new ShaderMaterial({
            vertexShader:v,
            fragmentShader:f,
            uniforms: {
                //主要贴图
                uTextureMain: { value: texture }, // 将纹理传入 shader
                uTextureOpacity: { value: textureOpacity }, // 将纹理传入 shader
            },
            transparent:true
        }))
    }
    addPlan(){

        const geometry = new PlaneGeometry(40, 40);
        const material = this.materials[0]
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
        this.camera.position.set(0, 0, 60);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

    }
    animate(){

        this.control.update()
        this.stats.update()
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }
}