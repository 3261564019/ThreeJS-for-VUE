import * as THREE from "three";
import {BaseInit, BaseInitParams} from "../../three/classDefine/baseInit";
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
            renderDomId:"#renderDom"
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.addPlan();

        this.addLight();

        this.addBall();

        this.animate()
    }
    addPlan(){

        const geometry = new PlaneGeometry(40, 40);
        const material = new MeshLambertMaterial({color: 0x222222});
        material.side=DoubleSide
        const plane = new Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true

        plane.rotation.x = -0.5 * Math.PI;
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
    addBall(){

        const sphere = new Mesh(
            new SphereGeometry(3, 33, 33),
            new MeshLambertMaterial({color: "#fff"})
        );

        sphere.position.x = 10;
        sphere.position.y = 3;
        sphere.castShadow = true

        this.scene.add(sphere);
    }
    init() {

        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.9;
        this.renderer.outputEncoding = LinearEncoding;

        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 30, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

    }
    animate(){
        this.stats.update()

        this.raf=requestAnimationFrame(this.animate.bind(this));

        this.renderer.render(this.scene, this.camera);
    }
}