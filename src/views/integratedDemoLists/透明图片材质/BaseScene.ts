
import * as THREE from "three";
import gsap from 'gsap';
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import img from "@/assets/img/cubeImg/5.png"
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import clarens_night_02_4k from "@/assets/hdr/clarens_night_02_4k.hdr?url";

import vertexShader from './temp1/vertex.glsl?raw';
import fragmentShader from '@/views/integratedDemoLists/透明图片材质/temp1/fragment.glsl?raw';

export class TransparentMaterial extends BaseInit {
    constructor() {
        super({
            needLight:false,
            renderDomId:"#transparentRoot",
            needOrbitControls:true,
            needAxesHelper:true,
            adjustScreenSize:true
        } as BaseInitParams);

        this.initDebug();

        console.log("fragmentShader",fragmentShader)

        this.init();

        this.addPlan();
        this.loadEnv()
        this.addLight();

        this.initDebug();

        // this.addBall();
        this.camera.position.set(0,30,30);
        this.camera.lookAt(0,0,0)
    }
    loadEnv(){
        new RGBELoader().load(clarens_night_02_4k, (texture) => {
            console.log("纹理对象", texture);

            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.encoding = THREE.sRGBEncoding;
            this.scene.environment = texture;
            this.scene.background = texture;

            this.manualRender()
        });
    }
    addPlan(){

        const geometry = new THREE.PlaneGeometry(40, 40);
        const material = new THREE.ShaderMaterial({
            //定点着色器
            vertexShader,
            fragmentShader,
            wireframe: false,
            transparent:true
        });

        // material.opacity=0.5;
        // material.side=THREE.DoubleSide
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
        light.position.y = 20;
        light.position.z = 20;

        this.scene.add(light);
    }
    addBall(){

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(3, 33, 33),
            new THREE.MeshLambertMaterial({color: "#fff"})
        );

        sphere.position.x = 10;
        sphere.position.y = -2;
        sphere.castShadow = true

        this.scene.add(sphere);
    }
    init() {

        this.renderer.shadowMap.enabled = true;

        this.camera.position.set(0, 30, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

        const clock = new THREE.Clock();

        const animate = () => {

            this.stats.update()

            this.raf=requestAnimationFrame(animate);

            this.renderer.render(this.scene, this.camera);
        }

        animate();

    }
}