
import * as THREE from "three";
import gsap from 'gsap';
import {BaseInit, BaseInitParams} from "../../three/classDefine/baseInit";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {OutlinePass} from "three/examples/jsm/postprocessing/OutlinePass";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader";
import {Mesh} from "three";

export class EffectScene extends BaseInit {
    composer:EffectComposer
    outLinePath:OutlinePass
    ball:Mesh
    FXAAShaderPass:ShaderPass
    constructor() {
        super({
            needLight:false,
            renderDomId:"#sceneDemo",
            needOrbitControls:true
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.addPlan();

        this.addLight();

        this.addBall();

        this.initEffectComposer()
    }
    initEffectComposer() {
        //初始化效果组合器
        this.composer = new EffectComposer(this.renderer);
        //创建场景通道
        let renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        //创建外边线通道
        this.outLinePath = new OutlinePass(
            //设置效果范围
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            this.scene,
            this.camera
        );
        //选中的边缘颜色
        this.outLinePath.visibleEdgeColor = new THREE.Color("#469dff");
        //选中模型隐藏部分边界颜色
        this.outLinePath.hiddenEdgeColor = new THREE.Color("#e47d0e");
        this.composer.addPass(this.outLinePath);


        // 去掉锯齿
        this.FXAAShaderPass = new ShaderPass(FXAAShader);
        this.FXAAShaderPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
        // FXAAShaderPass.renderToScreen = true;
        this.composer.addPass(this.FXAAShaderPass);


        this.outLinePath.selectedObjects.push(this.ball);
    }
    addPlan(){

        const geometry = new THREE.PlaneGeometry(40, 40);
        const material = new THREE.MeshLambertMaterial({color: 0xeeeeee});
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
        const light = new THREE.SpotLight("#fff",1);
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

        this.ball=sphere
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

            requestAnimationFrame(animate);

            // this.renderer.render(this.scene, this.camera);

            this.composer?.render(this.scene, this.camera);
        }

        animate();

    }
}