import * as THREE from "three";
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import PlayerControls from "../../../three/classDefine/PlayerControls";
import belfast_sunset_pure_sky_4k from "../../../assets/hdr/belfast_sunset_puresky_4k.hdr?url";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import landNormal from "/src/assets/texture/aerial_grass_rock_2k.gltf/textures/aerial_grass_rock_diff_2k.jpg";
import landAlpha from "/src/assets/texture/aerial_grass_rock_2k.gltf/textures/aerial_grass_rock_nor_gl_2k.jpg";
import landRgb from "/src/assets/texture/aerial_grass_rock_2k.gltf/textures/aerial_grass_rock_rough_2k.jpg";
import {RectAreaLightUniformsLib} from "three/examples/jsm/lights/RectAreaLightUniformsLib";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

interface DebugParams {
    //学校模型的Y轴偏移
    schoolPositionY: number
}

export class SceneDemo extends BaseInit {

    schoolScene: THREE.Group
    //道路模型
    roadScene: THREE.Group
    //地板模型
    planMesh: THREE.Mesh

    playerScene: THREE.Group
    //汽车场景
    carScene: THREE.Group
    //键盘事件

    debugParam: DebugParams = {
        schoolPositionY: 0.9
    }

    constructor({}) {
        super({
            needLight: false,
            needOrbitControls: false,
            renderDomId: "#sceneDemo",
            calcCursorPosition: true,
            needScreenSize: true,
            needAxesHelper: true,
            needTextureLoader: true
        } as BaseInitParams);

        this.initDebug();

        this.init();
        //添加地面
        this.addPlan();

        this.addLight();
        //创建资源加载管理器
        this.initResourceMange();
        //加载环境贴图
        this.loadSceneBg();
        //加载学校
        this.loadSchool();
        //加载道路
        // this.loadRoad();

        //加载玩家
        this.loadPlayer();
        //初始化调试器
        this.initDebug();

        this.addPlayerMoveListener();
    }

    loadRoad() {
        new GLTFLoader(this.loadManager).load("http://qrtest.qirenit.com:81/share/img/roadsbridges_-_tileset_pack/scene.gltf",
            (res) => {

                console.log("道路模型", res.scene);

                //所有部分
                let allPart = res.scene.children[0].children[0].children[0].children[0];
                //笔直的路
                let straight = allPart.children[0]
                //道路微端
                let end = allPart.children[1];
                //丁字路口
                let T = allPart.children[2];
                //十字路口
                let cross = allPart.children[3];
                let a = allPart.children[4];

                a.position.set(0, 0, 0)
                // console.log(a,"aaaa");
                // a.scale.set(0.006,0.006,0.006);
                a.scale.set(0.6, 0.6, 0.6);

                this.scene.add(a);
            });
    }

    addPlayerMoveListener() {
        document.addEventListener('keypress', (p) => {
            console.log('我按下了press', p);
        })
    }

    loadPlayer() {
        new GLTFLoader(this.loadManager).load("http://qrtest.qirenit.com:81/share/img/pubg_coupe_rb/scene.gltf",
            (res) => {

                console.log("汽车模型", res);

                res.scene.position.z = 100;
                res.scene.rotateY(Math.PI/2);
                res.scene.scale.set(0.006, 0.006, 0.006);
                this.carScene = res.scene;

                this.control=new PlayerControls(this.camera, this.carScene);

                this.control.moveSpeed = 1;
                this.control.turnSpeed = 0.1;

                this.dat.add(this.carScene.position, "y", -500, 500, 0.1).name("人物z轴");

                this.scene.add(this.carScene);
            });
    }

    loadSchool() {
        new GLTFLoader(this.loadManager).load("http://qrtest.qirenit.com:81/share/img/pubg_school/scene.gltf",
            (res) => {

                console.log("学校模型", res);

                res.scene.position.y = this.debugParam.schoolPositionY;
                this.schoolScene = res.scene

                this.dat.add(this.schoolScene.position, "y", -5, 5, 0.1).name("学校Y轴");

                this.scene.add(this.schoolScene);
            });
    }

    initResourceMange() {
        this.loadManager = new THREE.LoadingManager(
            () => {
                console.log('加载完成');
            },
            // Progress
            (p) => {
            });
    }

    loadSceneBg() {
        new RGBELoader(this.loadManager).load(belfast_sunset_pure_sky_4k, (texture) => {
            console.log("纹理对象", texture);

            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.encoding = THREE.sRGBEncoding;
            this.scene.environment = texture;
            this.scene.background = texture;

            this.manualRender()
        });
    }

    addPlan() {

        const geometry = new THREE.PlaneGeometry(300, 300);
        const material = new THREE.MeshLambertMaterial({
            map: this.textureLoader.load(landNormal),
            color: "#eee",
            //此属性能产生凹陷  必须在创建图形时指定片段数，不然无效
            displacementMap: this.textureLoader.load(landAlpha),
            //塌陷和凸起的程度
            displacementScale: 2,
            transparent: false,
            normalMap: this.textureLoader.load(landRgb)     //可以模拟光照在物体上亮度的贴图
        });
        material.side = THREE.DoubleSide
        const plane = new THREE.Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        this.planMesh = plane
        //添加地板容器
        this.scene.add(this.planMesh);

    }

    addLight() {
        //创建聚光灯
        const light = new THREE.SpotLight("#fff");
        light.castShadow = true;            // default false
        light.position.x = 400;
        light.position.y = 30;
        this.scene.add(light);
    }

    init() {

        this.camera.position.set(0, 100, 100)
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position);

        // this.control.enableDamping = true;

        const clock = new THREE.Clock();

        const animate = () => {

            if(this.control){
                this.control.update();
            }

            this.stats.update()

            requestAnimationFrame(animate);

            this.renderer.render(this.scene, this.camera);
        }

        animate();

    }
}