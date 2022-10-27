import * as THREE from "three";
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import PlayerControls from "../../../three/classDefine/PlayerControls";
import belfast_sunset_pure_sky_4k from "../../../assets/hdr/belfast_sunset_puresky_4k.hdr?url";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import landNormal from "/src/assets/texture/aerial_grass_rock_2k.gltf/textures/aerial_grass_rock_diff_2k.jpg";
import landAlpha from "/src/assets/texture/aerial_grass_rock_2k.gltf/textures/aerial_grass_rock_nor_gl_2k.jpg";
import landRgb from "/src/assets/texture/aerial_grass_rock_2k.gltf/textures/aerial_grass_rock_rough_2k.jpg";
import {RectAreaLightUniformsLib} from "three/examples/jsm/lights/RectAreaLightUniformsLib";
import THREEx from "/src/three/otherModule/threex.keyboardstate.js"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {CSS3DRenderer} from "three/examples/jsm/renderers/CSS3DRenderer";
import {AnimationMixer, Scene} from "three";
import {CSS2DObject, CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import dancerFbx from "/src/assets/model/sambaDancing.fbx?url"

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
    //正方形房子
    squareHouse: THREE.Mesh
    //汽车模型
    playerScene: THREE.Group
    //汽车场景
    carScene: THREE.Group
    //键盘事件
    keyboard = null;
    //标签渲染器
    labelRenderer:CSS2DRenderer;
    //动画播放器
    animationMixer:AnimationMixer
    //场景加载完的回调函数
    finishedCallBack:Function

    debugParam: DebugParams = {
        schoolPositionY:1
    }

    constructor({
                    finished
                }) {
        super({
            needLight: false,
            needOrbitControls: false,
            renderDomId: "#sceneDemo",
            calcCursorPosition: true,
            needScreenSize: true,
            needAxesHelper: true,
            needTextureLoader: true,
            orbitControlsDom:"schoolInfo"
        } as BaseInitParams);

        this.finishedCallBack=finished;

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

        //加载房屋
        this.loadHouse();

        //加载建筑组
        this.loadBuilding();

        //加载玩家 即 汽车
        this.loadPlayer();
        //初始化调试器
        this.initDebug();

        this.loadDancer();
    }
    loadDancer(){
        const loader = new FBXLoader();
        loader.load( dancerFbx,  ( object )=>{

            this.animationMixer = new AnimationMixer( object );
            console.log("人体对象",object);
            const action = this.animationMixer.clipAction(object.animations[ 0 ] );

            action.play();

            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            } );

            object.scale.set(0.1,0.1,0.1);
            object.position.set(0,10,0);
            this.scene.add(object);

        } );
    }
    loadBuilding(){
        new GLTFLoader(this.loadManager).load("http://qrtest.qirenit.com:81/share/img/game_low_poly_buildings/scene.gltf",
            (res) => {
                // console.log("建筑模型", res);


                //所有部分
                let allPart = res.scene.children[0].children[0].children[0].children[0].children;

                console.log("所有部分",allPart)
                // res.scene.scale.set(35,35,35);
                res.scene.position.set(0,3,0)

                let house1=allPart[1];
                house1.position.set(-90,0,0);
                house1.scale.set(0.2,0.2,0.2);

                this.scene.add(house1);
            })
    }
    loadHouse() {

        new GLTFLoader(this.loadManager).load("http://qrtest.qirenit.com:81/share/img/pubg_mobile_solo_squad_house/scene.gltf",
            (res) => {
                console.log("房屋模型",res);
                this.squareHouse=res.scene;

                this.squareHouse.position.set(325,0,80);
                this.squareHouse.rotation.y=Math.PI/3;

                this.dat.add(this.squareHouse.position,"x",-600,600).name("房屋X轴");
                this.dat.add(this.squareHouse.position,"z",-600,600).name("房屋Z轴");
                this.dat.add(this.squareHouse.rotation,"y",-Math.PI,Math.PI,0.01).name("房屋旋转");

                this.scene.add(this.squareHouse);
            })

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
    loadPlayer() {
        new GLTFLoader(this.loadManager).load("http://qrtest.qirenit.com:81/share/img/pubg_coupe_rb/scene.gltf",
            (res) => {

                console.log("汽车模型", res);

                res.scene.position.set(0, 1, 90);
                res.scene.rotation.y = Math.PI / 3;
                res.scene.scale.set(0.006, 0.006, 0.006);

                this.carScene = res.scene;
                this.carScene.rotation.y = Math.PI / 2
                // this.control=new PlayerControls(this.camera, this.carScene);

                // this.control.moveSpeed = 1;
                // this.control.turnSpeed = 0.1;

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

                //添加文字标签
                const label = new CSS2DObject(document.getElementById("schoolInfo"));
                label.position.set( 0, 10, 0 );

                this.schoolScene.add(label);

                this.dat.add(this.schoolScene.position, "y", -5, 5, 0.1).name("学校Y轴");

                this.scene.add(this.schoolScene);
            });
    }

    initResourceMange() {
        // let that=this;
        this.loadManager = new THREE.LoadingManager(
            () => {
                console.log('加载完成',this);
                this.finishedCallBack();
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

        const geometry = new THREE.PlaneGeometry(200, 200);
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
        const light = new THREE.AmbientLight("#fff",1);
        light.castShadow = true;            // default false
        this.scene.add(light);

        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x222222 );
        hemiLight.position.set( 0, 200, 0 );
        this.scene.add( hemiLight );
    }
    initLabelRender(){
        let labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize( window.innerWidth, window.innerHeight );
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        document.body.appendChild( labelRenderer.domElement );
        this.labelRenderer=labelRenderer;
    }
    init() {

        this.camera.position.set(0, 400, 400)
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position);
        //创建键盘事件
        this.keyboard = new THREEx.KeyboardState();
        //使渲染器支持真实光照
        this.renderer.physicallyCorrectLights=true;
        this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
        //创建标签渲染器
        this.initLabelRender();
        //创建控制器并说明可操作图层为标签渲染器的节点
        this.control=new OrbitControls( this.camera,this.labelRenderer.domElement );
        this.control.enableDamping = true;

        const clock = new THREE.Clock();
        const animate = () => {

            const delta = clock.getDelta();
            const moveDistance = 50 * delta;

            const rotateAngle = Math.PI / 2 * delta;

            this.stats.update()
            this.control.update()



            if (this.keyboard.pressed('s'))
                this.carScene.translateX(-moveDistance);
            if (this.keyboard.pressed('w'))
                this.carScene.translateX(moveDistance);
            if (this.keyboard.pressed('a'))
                this.carScene.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
            if (this.keyboard.pressed('d'))
                this.carScene.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);


            // if (this.keyboard.pressed('w'))
            //     this.carScene.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotateAngle);
            // if (this.keyboard.pressed('s'))
            //     this.carScene.rotateOnAxis(new THREE.Vector3(1, 0, 0), -rotateAngle);
            // if (this.keyboard.pressed('a'))
            //     this.carScene.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
            // if (this.keyboard.pressed('d'))
            //     this.carScene.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);


            //让相机位置与车辆位置相对固定
            // if(this.carScene){
            //     const relativeCameraOffset = new THREE.Vector3(-1000, 5000, 5000);
            //     const cameraOffset = relativeCameraOffset.applyMatrix4( this.carScene.matrixWorld );
            //     this.camera.position.x = cameraOffset.x;
            //     this.camera.position.y = cameraOffset.y;
            //     this.camera.position.z = cameraOffset.z;
            //     // 始终让相机看向物体
            //     this.control.target = this.carScene.position;
            //     // console.log(this.carScene?.matrixWorld);
            // }

            if(this.animationMixer){
                this.animationMixer.update(delta);
            }

            requestAnimationFrame(animate);

            this.renderer.render(this.scene, this.camera);

            this.labelRenderer.render(this.scene,this.camera);
        }

        animate();

    }
}