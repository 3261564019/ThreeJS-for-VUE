
import * as THREE from "three";
import gsap from 'gsap';
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import v from "@/shaders/gradientWall/v.glsl?url"
import f from "@/shaders/gradientWall/f.glsl?url"

export class BaseScene extends BaseInit {
    constructor() {
        super({
            needLight:false,
            renderDomId:"#renderDom",
            needOrbitControls:true,
            renderBg:"#202124",
            needAxesHelper:true
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.addPlan();

        this.addLight();

        this.addBox();
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
        plane.position.y = -0.1;
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
    addBox(){

        const geometry = new THREE.BoxGeometry( 5, 5, 5 );
        const material = new THREE.RawShaderMaterial( {
            uniforms: {
                time: { value: 1.0 },
                resolution: { value: new THREE.Vector2() }
            },
            vertexShader:v,
            fragmentShader:v
        });
        const cube = new THREE.Mesh( geometry, material );
        cube.position.y=2.6;
        this.scene.add( cube );

    }
    init() {

        this.renderer.shadowMap.enabled = true;

        this.camera.position.set(0, 30, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

        // const clock = new THREE.Clock();

        const animate = () => {

            this.stats.update()

            this.raf=requestAnimationFrame(animate);

            this.renderer.render(this.scene, this.camera);
        }

        animate();

    }
}