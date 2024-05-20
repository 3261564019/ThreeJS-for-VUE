import {
    ACESFilmicToneMapping,
    BoxGeometry,
    Clock,
    DoubleSide,
    Mesh, MeshStandardMaterial, NormalBlending,
    PlaneGeometry,
    ShaderMaterial,
    SphereGeometry
} from "three";

import v from "./vertex.glsl?raw"
import f from "./fragment.glsl?raw"
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";

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

        this.initDebug();

        this.init();
        this.createMaterial()
        this.addPlan();
        this.animate()
        this.addBox()
    }
    addBox(){
        let m=new Mesh(new BoxGeometry(9,9,9),new MeshStandardMaterial({color:"#ccc"}))
        m.renderOrder=3
        m.position.set(50,0,0)
        this.scene.add(m)
    }
    createMaterial(){
        // this.material=new ShaderMaterial({
        //     // vertexShader:v,
        //     // fragmentShader:f,
        //     // uniforms: {
        //     //     uTime: { value: 0 }, // 将纹理传入 shader
        //     // },
        //     transparent:false,
        //     wireframe:false,
        //     // depthTest:true
        // })

        // this.material.blending=NormalBlending
    }
    addPlan(){

        this.material=new ShaderMaterial({
        })
        const geometry = new SphereGeometry(40, 40,80,80);
        const material = this.material
        // material.side=DoubleSide
        const plane = new Mesh(geometry, material);
        plane.renderOrder=3
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
        // this.material.uniforms.uTime.value=this.clock.getElapsedTime();
        this.control.update()
        this.stats.update()
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }
}