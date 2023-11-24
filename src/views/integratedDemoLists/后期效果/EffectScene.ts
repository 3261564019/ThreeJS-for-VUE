
import * as THREE from "three";
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {OutlinePass} from "three/examples/jsm/postprocessing/OutlinePass";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader";
import {Clock, Mesh} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import my from "@/assets/model/111.gltf?url"

export class EffectScene extends BaseInit {
    // @ts-ignore
    composer:EffectComposer
    // @ts-ignore
    outLinePath:OutlinePass
    // @ts-ignore
    ball:Mesh
    // @ts-ignore
    FXAAShaderPass:ShaderPass
    private clock: Clock;
    constructor() {
        super({
            needLight:false,
            renderDomId:"#sceneDemo",
            needOrbitControls:true,
            renderBg:"#202124",
            needAxesHelper:true
        } as BaseInitParams);

        this.clock = new THREE.Clock();

        this.initDebug();

        this.init();

        this.addPlan();

        this.addLight();

        this.addBall();

        this.initEffectComposer()

        this.loadModel();

        this.animate();
    }
    loadModel(){
        let loader =new GLTFLoader()
        loader.load(my,(e)=> {
            console.log("加载结果", e)

            e.scene.position.set(0,3,0)

            this.outLinePath.selectedObjects.push(e.scene)

            this.scene.add(e.scene)
        })
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
            this.camera,
        );
        //选中的边缘颜色
        this.outLinePath.visibleEdgeColor = new THREE.Color("#469dff");
        //边缘强度 发光亮度
        this.outLinePath.edgeStrength=10
        //边缘光渐变程度
        this.outLinePath.edgeThickness=10
        //发光区域闪烁频率
        this.outLinePath.pulsePeriod=2
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


        const gridHelper = new THREE.GridHelper( 50, 10 );
        gridHelper.position.y=-0.2
        this.scene.add( gridHelper );

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

        sphere.position.set(10,0,0)

        sphere.castShadow = true

        this.ball=sphere
        this.scene.add(sphere);
    }
    init() {

        this.renderer.shadowMap.enabled = true;

        this.camera.position.set(0, 30, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)


    }
    animate(){
        this.raf=requestAnimationFrame(this.animate.bind(this));

        this.stats.update()

        this.renderer.render(this.scene, this.camera);

        this.composer?.render(this.clock.getDelta());
    }
}