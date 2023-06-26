import * as THREE from "three";
import {AnimationMixer, MeshToonMaterial, Scene} from "three";
import {BaseInit, BaseInitParams} from "../../../../three/classDefine/baseInit";
import belfast_sunset_pure_sky_4k from "../../../../assets/hdr/belfast_sunset_puresky_4k.hdr?url";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import landNormal from "/src/assets/texture/aerial_grass_rock_2k.gltf/textures/aerial_grass_rock_diff_2k.jpg";
import landAlpha from "/src/assets/texture/aerial_grass_rock_2k.gltf/textures/aerial_grass_rock_nor_gl_2k.jpg";
import landRgb from "/src/assets/texture/aerial_grass_rock_2k.gltf/textures/aerial_grass_rock_rough_2k.jpg";
// @ts-ignore
import THREEx from "/src/three/otherModule/threex.keyboardstate.js"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {CSS3DObject, CSS3DRenderer} from "three/examples/jsm/renderers/CSS3DRenderer";
import {CSS2DObject, CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import dancerFbx from "/src/assets/model/sambaDancing.fbx?url"
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {OutlinePass} from "three/examples/jsm/postprocessing/OutlinePass";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader";
import {debounce} from "../../../../utils";

interface DebugParams {
    //学校模型的Y轴偏移
    schoolPositionY: number
}


let mouseMoveCallBack,screenReSizeCallBack;


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
    //动画播放器
    animationMixer: AnimationMixer
    //场景加载完的回调函数
    finishedCallBack: Function
    //infoWindow创建完，可以初始化Vue组件的回调
    initVueCpn: Function
    //射线
    rayCaster: THREE.Raycaster = new THREE.Raycaster()
    //当前选中的物体
    currentMesh: THREE.Mesh;

    composer: EffectComposer
    outLinePath: OutlinePass
    FXAAShaderPass:ShaderPass

    // css3DScene
    cssScene: Scene
    cssRender: CSS3DRenderer
    //标签渲染器
    labelRenderer: CSS2DRenderer;

    debugParam: DebugParams = {
        schoolPositionY: 1
    }

    //当前鼠标偏移量
    mouseCoords: THREE.Vector2 = new THREE.Vector2(2, 2);

    //选中的物体的材质
    checkedMaterial: MeshToonMaterial = new MeshToonMaterial({
        color: "#049ef4"
    });

    constructor({
                    finished,
                    initVueCpn
                }) {
        super({
            needLight: false,
            needOrbitControls: false,
            renderDomId: "#sceneDemo",
            calcCursorPosition: true,
            needScreenSize: true,
            needAxesHelper: true,
            needTextureLoader: true,
            orbitControlsDom: "schoolInfo",
            adjustScreenSize:true
        } as BaseInitParams);

        this.finishedCallBack = finished;
        this.initVueCpn=initVueCpn;

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
        // this.loadSchool();
        //加载道路
        // this.loadRoad();

        //加载房屋
        // this.loadHouse();

        //加载建筑组
        // this.loadBuilding();

        //加载玩家 即 汽车
        this.loadPlayer();
        //初始化调试器
        this.initDebug();
        //加载跳舞动画
        // this.loadDancer();
        //加载dom节点至场景
        // this.addDomContent();

        //css3DRender 在屏幕尺寸发生变化的情况下进行适配
        this.resizeRender();

        //屏幕尺寸已经在父类进行统计 此时监听鼠标位置 计算出偏移量
        this.mouseCoordsCalc();

        //添加点击事件
        // this.addEvent();

        // this.addBall();


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
        this.outLinePath.pulsePeriod=2.5;

        this.composer.addPass(this.outLinePath);

        // 去掉锯齿
        // this.FXAAShaderPass = new ShaderPass(FXAAShader);
        // this.FXAAShaderPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
        // this.FXAAShaderPass.renderToScreen = true;
        // this.composer.addPass(this.FXAAShaderPass);
    }

    addBall() {

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(3, 33, 33),
            new THREE.MeshLambertMaterial({color: "#fff"})
        );

        sphere.position.x = 10;
        sphere.position.y = 30;
        sphere.castShadow = true

        this.scene.add(sphere);
    }

    addEvent() {
        window.addEventListener("click", () => {
            console.log(this.currentMesh);
            //
            //
            // let temp =this.currentMesh.clone()
            // temp.material=this.checkedMaterial;
            //
            // temp.position.set(this.currentMesh.position);
            //
            // this.scene.add(temp);
        })
    }

    mouseCoordsCalc() {

        mouseMoveCallBack=(event) => {
            this.mouseCoords.x = (event.clientX / this.screenSize.x * 2) - 1
            this.mouseCoords.y = -(event.clientY / this.screenSize.y * 2) + 1
        };

        window.addEventListener("mousemove",mouseMoveCallBack)
    }

    resizeRender() {

        screenReSizeCallBack=debounce(()=>{
            let dom = this.cssRender.domElement;
            console.log(dom.offsetWidth, dom.offsetHeight);
            this.cssRender.setSize(window.innerWidth, window.innerHeight);
            this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.composer.setSize(window.innerWidth, window.innerHeight);
            this.FXAAShaderPass?.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
        },1000)

        window.addEventListener("resize",screenReSizeCallBack);
    }

    loadDancer() {
        const loader = new FBXLoader();
        loader.load(dancerFbx, (object) => {

            this.animationMixer = new AnimationMixer(object);
            console.log("人体对象", object);
            const action = this.animationMixer.clipAction(object.animations[0]);

            action.play();

            object.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            object.scale.set(0.1, 0.1, 0.1);
            object.position.set(0, 10, 0);
            this.scene.add(object);

        });
    }

    loadBuilding() {
        new GLTFLoader(this.loadManager).load("http://qrtest.qirenit.com:81/share/img/game_low_poly_buildings/scene.gltf",
            (res) => {
                // console.log("建筑模型", res);


                //所有部分
                let allPart = res.scene.children[0].children[0].children[0].children[0].children;

                console.log("所有部分", allPart)
                // res.scene.scale.set(35,35,35);
                res.scene.position.set(0, 3, 0)

                let house1 = allPart[1];
                house1.position.set(-90, 0, 0);
                house1.scale.set(0.2, 0.2, 0.2);

                this.scene.add(house1);
            })
    }

    loadHouse() {

        new GLTFLoader(this.loadManager).load("http://qrtest.qirenit.com:81/share/img/pubg_mobile_solo_squad_house/scene.gltf",
            (res) => {
                console.log("房屋模型", res);
                this.squareHouse = res.scene;

                this.squareHouse.position.set(325, 0, 80);
                this.squareHouse.rotation.y = Math.PI / 3;

                this.dat.add(this.squareHouse.position, "x", -600, 600).name("房屋X轴");
                this.dat.add(this.squareHouse.position, "z", -600, 600).name("房屋Z轴");
                this.dat.add(this.squareHouse.rotation, "y", -Math.PI, Math.PI, 0.01).name("房屋旋转");

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
                // const label = new CSS2DObject(document.getElementById("schoolInfo"));
                // label.position.set(0, 10, 0);

                // this.schoolScene.add(label);

                this.dat.add(this.schoolScene.position, "y", -5, 5, 0.1).name("学校Y轴");

                this.scene.add(this.schoolScene);
            });
    }

    initResourceMange() {
        // let that=this;
        this.loadManager = new THREE.LoadingManager(
            () => {
                console.log('加载完成', this);
                this.finishedCallBack();
                this.startAnimation();
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
        const material = new THREE.MeshLambertMaterial({color: 0xeee});

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
        const light = new THREE.SpotLight(0xffffff);
        light.castShadow = true;
        light.position.set(200,200,0)
        light.lookAt(0,0,0)
        light.castShadow = true;            // default false

        light.shadow.camera.near = 50;
        light.shadow.camera.far = 400;
        light.shadow.camera.fov = 30;
        this.scene.add(light);

        const spotLightHelper = new THREE.SpotLightHelper( light );
        this.scene.add( spotLightHelper );

        // const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff);
        // hemiLight.position.set(0, 200, 0);
        // this.scene.add(hemiLight);

        //调整场景曝光亮度
        this.dat.add(this.renderer, "toneMappingExposure", 0, 5, 0.001).name("整体亮度");
        this.renderer.toneMappingExposure = 1.3;
    }

    initLabelRender() {
        let labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.domElement.id="labelRenderer"
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        labelRenderer.domElement.style.left = '0px';
        labelRenderer.domElement.style.zIndex = '10';//设置层
        // labelRenderer.domElement.onclick((e:MouseEvent)=>{
        //     e.cancelBubble=true
        // })
        document.body.appendChild(labelRenderer.domElement);
        this.labelRenderer = labelRenderer;

        this.control = new OrbitControls(this.camera, labelRenderer.domElement);
        this.control.enableDamping=true;
    }
    addLabelDom(){
        const label = new CSS2DObject(document.getElementById("infoMarker"));
        label.position.set(0,50,0);
        this.scene.add(label)
        this.initVueCpn();
    }
    initCss3DRender() {
        const cssScene = new THREE.Scene();
        const cssRender = new CSS3DRenderer();
        cssRender.setSize(window.innerWidth, window.innerHeight);
        cssRender.domElement.style.position = "absolute";
        cssRender.domElement.style.top = 0;
        cssRender.domElement.id = "cssRenderDom";

        document.body.appendChild(cssRender.domElement);
        this.cssScene = cssScene;
        this.cssRender = cssRender;
    }

    addDomContent() {
        const context = new CSS3DObject(document.getElementById("contentDemo"));
        context.position.set(-90, 40, 0);
        context.scale.set(0.1, 0.1, 0.1);
        // context.translateY(30);
        this.cssScene.add(context);
    }

    calcIntersect() {

        let intersects = this.rayCaster.intersectObjects(this.scene.children, true);

        if (intersects.length != 0 && intersects[0].object instanceof THREE.Mesh) {
            // 将当前材质修改为被击中材质
            this.outLinePath.selectedObjects = [];
            this.outLinePath.selectedObjects.push(intersects[0].object);
        }
    }

    test() {
        console.log(this.currentMesh);

        // this.currentMesh.position.set(10,0,0);
        // console.log("ggg");
    }

    //开始渲染动画
    startAnimation() {
        const clock = new THREE.Clock();
        const animate = () => {

            this.raf=requestAnimationFrame(animate);

            //更新控制器
            this.control?.update()
            //更新射线
            this.rayCaster.setFromCamera(this.mouseCoords, this.camera);
            //统计相交物体
            this.calcIntersect()

            const delta = clock.getDelta();
            const moveDistance = 50 * delta;
            const rotateAngle = Math.PI / 2 * delta;
            //更新统计帧率的工具
            this.stats.update()

            //移动小车位置
            if (this.keyboard.pressed('s'))
                this.carScene.translateX(-moveDistance);
            if (this.keyboard.pressed('w'))
                this.carScene.translateX(moveDistance);
            if (this.keyboard.pressed('a'))
                this.carScene.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
            if (this.keyboard.pressed('d'))
                this.carScene.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);

            this.renderer.render(this.scene, this.camera);
            this.labelRenderer.render(this.scene, this.camera);
            this.cssRender.render(this.cssScene, this.camera);
            // this.composer.render(this.scene, this.camera);

            // console.log(this.composer);

            if (this.animationMixer) {
                this.animationMixer.update(delta);
            }
        }
        animate();
    }

    init() {

        this.camera.position.set(0, 300, 0)
        //定位相机指向场景中心
        this.camera.lookAt(0, 0, 0);
        //创建键盘事件
        this.keyboard = new THREEx.KeyboardState();
        //使渲染器支持真实光照
        this.renderer.physicallyCorrectLights = true;
        // this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        //创建标签渲染器
        this.initLabelRender();
        //添加2D节点
        this.addLabelDom();
        //创建Css3D节点渲染器
        this.initCss3DRender();
        //将dom节点添加至3D场景
        this.addDomContent();
        // 初始化后期处理 选中描边
        this.initEffectComposer();

        //创建控制器并说明可操作图层为标签渲染器的节点
        this.control = new OrbitControls(this.camera, this.cssRender.domElement);
        this.control.enableDamping = true;
        //设置射线构造器的射线距离
        this.rayCaster.near = 1;
        this.rayCaster.far = 500;

    }

    destroy() {
        super.destroy();

        console.log("render",this.labelRenderer)
        // @ts-ignore
        this.labelRenderer.domElement.parentNode.removeChild(this.labelRenderer.domElement)
        // @ts-ignore
        this.cssRender.domElement.parentNode.removeChild(this.cssRender.domElement)

        // @ts-ignore
        this.cssScene=null

        // @ts-ignore
        window.removeEventListener("mousemove",mouseMoveCallBack)
        // @ts-ignore
        window.removeEventListener("resize",screenReSizeCallBack)
    }
}