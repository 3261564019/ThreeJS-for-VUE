import * as THREE from "three";
import {BaseInit, BaseInitParams} from "./core/baseInit";

export class BaseScene extends BaseInit {
    constructor() {
        super({
            renderDomId:"#renderDom",
            needDebug:true,
            needStats:true,
            needOrbitControls:true,
            adjustScreenSize:true
        } as BaseInitParams);

        this.init();

        this.addPlan();

        this.addLight();

        this.addBall();

        this.animate()
    }
    addPlan(){

        const geometry = new THREE.PlaneGeometry(40, 40);
        const material = new THREE.MeshLambertMaterial({color: 0x222222});
        material.side=THREE.DoubleSide
        const plane = new THREE.Mesh(geometry, material);
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
        const light = new THREE.SpotLight("#fff");
        light.castShadow = true;            // default false
        light.position.x = 20;
        light.position.y = 30;

        this.scene.add(light);
    }
    addBall(){

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(3, 33, 33),
            new THREE.MeshLambertMaterial({color: "#fff"})
        );

        sphere.position.x = 10;
        sphere.position.y = 3;
        sphere.castShadow = true

        this.scene.add(sphere);
    }
    init() { 
        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 30, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

    }
    animate(){

        this.control.update()
        this.renderer.render(this.scene, this.camera);
        this.stats.update()

        requestAnimationFrame(this.animate.bind(this));
    }
}