import {ACESFilmicToneMapping, Clock, DoubleSide, Mesh, PlaneGeometry, ShaderMaterial} from "three";

import v from "./vertex.glsl?raw"
import f from "./fragment.glsl?raw"
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";

export class BaseScene extends BaseInit {

    material:ShaderMaterial
    private clock:Clock;
    private plane: Mesh<PlaneGeometry, ShaderMaterial>;


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
        this.material=new ShaderMaterial({
            vertexShader:v,
            fragmentShader:f,
            uniforms: {
                uTime: { value: 0 }, // 将纹理传入 shader
            },
            transparent:true,
            wireframe:false,
            depthTest:true
        })
    }
    addPlan(){

        const geometry = new PlaneGeometry(40, 40,10,10);
        const material = this.material
        material.side=DoubleSide
        const plane = new Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        this.plane=plane
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

        // if(this.plane){
        //     this.plane.lookAt(this.camera.position)
        // }

        this.material.uniforms.uTime.value=this.clock.getElapsedTime();
        this.control.update()
        this.stats.update()
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }
}