
import {
    ACESFilmicToneMapping, Clock,
    DoubleSide, LinearEncoding,
    Mesh,
    MeshLambertMaterial,
    PlaneGeometry,
    SpotLight
} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import {PhysicBase} from "@/views/unsuccessful/cannon调试/PhysicBase";

export class BaseScene extends BaseInit {

    private physicIns:PhysicBase
    private clock: Clock;

    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            needAxesHelper:true,
            renderDomId:"#renderDom"
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.addPlan();

        this.addLight();

        this.physicIns=new PhysicBase(this)

        this.animate()
    }
    addPlan(){

        const geometry = new PlaneGeometry(40, 40);
        const material = new MeshLambertMaterial({color: 0x222222});
        material.side=DoubleSide
        const plane = new Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true

        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;
        plane.rotateX(Math.PI/2);
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
        this.renderer.outputEncoding = LinearEncoding;
        this.control.enableDamping=true;
        this.control.dampingFactor = 0.08;
        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 0, 60);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)
        this.clock=new Clock()
    }
    animate(){

        this.control.update()
        this.stats.update()
        this.physicIns.render(this.clock.getDelta(),this.clock.elapsedTime)
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }
}