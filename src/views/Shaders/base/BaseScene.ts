import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import {
    ACESFilmicToneMapping,
    DoubleSide,
    LinearEncoding, Mesh,
    MeshLambertMaterial,
    PlaneGeometry,
    SphereGeometry, SpotLight
} from "three";

export class BaseScene extends BaseInit {
    constructor() {
        super({
            needLight:false,
            renderDomId:"#shaderDemo",
            needOrbitControls:true,
            transparentRenderBg:true,
            needAxesHelper:true
        } as BaseInitParams);

        this.initDebug();
        this.init();
        this.addPlan();
        this.animate()
    }
    addPlan(){

        const geometry = new PlaneGeometry(40, 40);
        const material = new MeshLambertMaterial({color: 0x222222});
        material.side=DoubleSide
        const plane = new Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true

        // plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        //添加地板容器
        this.scene.add(plane);

    }
    init() {
        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.9;
        this.renderer.shadowMap.enabled = true;
        this.control.enableDamping=true;
        this.control.dampingFactor=0.09
        this.camera.position.set(0, 0, 60);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)
    }
    animate(){
        this.stats.update()
        this.control.update()
        this.raf=requestAnimationFrame(this.animate.bind(this));

        this.renderer.render(this.scene, this.camera);
    }
}