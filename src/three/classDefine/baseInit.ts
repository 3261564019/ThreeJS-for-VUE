import {AudioLoader, PerspectiveCamera, Scene, TextureLoader, WebGLRenderer} from "three";
import * as THREE from "three";
import Stats from 'stats-js';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export interface BaseInitParams {
    //是否需要坐标指示器
    needAxesHelper: boolean,
    //是否需要灯光范围边界线
    needLightHelper: boolean,
    //渲染器的背景色
    renderBg: string,
    //是否需要添加默认灯光
    needLight: boolean,
    //纹理加载器
    needTextureLoader: boolean;
    //是否需要初始化好OrbitControls
    needOrbitControls: boolean,
    //渲染器背景透明
    transparentRenderBg: boolean,
    //是否相机添加进场景 【为false不会将相机对象添加至场景，但是会创建相机对象】
    AddCameraToScene: boolean,
    //是否需要声音加载器
    needAudioLoader: boolean,
    //是否需要加载器
    needGLTFLoader: boolean,
    //渲染到指定节点的id 将被直接用于 querySelector
    renderDomId: string,
    //是否需要实时计算鼠标位置
    calcCursorPosition: boolean
    //需要统计屏幕大小
    needScreenSize: THREE.Vector2
}

export class BaseInit {

    public scene: Scene;
    public camera: PerspectiveCamera;
    public renderer: WebGLRenderer;
    //显示帧率的对象
    public stats: any;
    public control: any;
    //页面调试工具对象
    public dat: any;
    //灯光对象
    public light: any;
    //纹理加载器
    public textureLoader: TextureLoader;
    //声音加载器
    public audioLoader: AudioLoader
    //GLTF加载器
    public gltfLoader: GLTFLoader
    //当前鼠标在屏幕可视区的位置x和y取值在屏幕宽高之间
    public cursorPosition: THREE.Vector2
    //屏幕宽高
    public screenSize: THREE.Vector2

    constructor(params: BaseInitParams = {
        needLightHelper: false,
        needAxesHelper: false,
        renderBg: "#282c34",
        needLight: true,
        needTextureLoader: false,
        needOrbitControls: true,
        transparentRenderBg: false,
        AddCameraToScene: true,
        needAudioLoader: false,
        needGLTFLoader: false,
        needScreenSize: false,
        renderDomId: '#webGl'
    }) {

        const scene = new THREE.Scene();
        //创建相机对象  可视范围常用（45-75）  长宽比 近截面（near）和远截面（far）。 当物体某些部分比摄像机的远截面远或者比近截面近的时候，该这些部分将不会被渲染到场景中。
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.3, 2000);
        // 创建挂载器
        const renderer = new THREE.WebGLRenderer({
            //开启抗锯齿
            antialias: true,
        });

        //如果需要透明背景需要将渲染器的颜色通道设置为完全透明
        if (params.transparentRenderBg) {
            renderer.setClearAlpha(0)
        } else {
            // 设置渲染器背景初始颜色
            renderer.setClearColor(new THREE.Color(params.renderBg))
        }

        // 设置挂载器尺寸并添加至页面
        renderer.setSize(window.innerWidth, window.innerHeight);

        //设置HDR显示效果 这个属性用于在普通计算机显示器或者移动设备屏幕等低动态范围介质上，模拟、逼近高动态范围（HDR）效果。
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        //场景曝光以及亮度
        renderer.toneMappingExposure = 0.6;

        renderer.outputEncoding = THREE.sRGBEncoding;


        //创建三维坐标系坐标
        if (params.needAxesHelper) {
            const axesHelper = new THREE.AxesHelper(20);
            scene.add(axesHelper);
        }

        document.querySelector(params.renderDomId).appendChild(renderer.domElement);

        //创建相机对象
        camera.position.set(0, 0, 100);
        camera.lookAt(0, 0, 0);

        if (params.AddCameraToScene) {
            scene.add(camera);
        }


        //创建聚光灯
        if (params.needLight) {
            const light = new THREE.SpotLight("#fff");
            light.castShadow = true;            // default false
            light.position.set(100, 100, 100);
            this.light = light;
            scene.add(light);

            if (params.needLightHelper) {
                const spotLightHelper = new THREE.SpotLightHelper(light);
                scene.add(spotLightHelper);
            }

        }


        if (params.needTextureLoader) {
            this.textureLoader = new TextureLoader();
        }

        if (params.needOrbitControls) {
            this.control = new OrbitControls(camera, renderer.domElement);
        }

        if (params.needAudioLoader) {
            this.audioLoader = new THREE.AudioLoader();
        }

        if (params.needGLTFLoader) {
            this.gltfLoader = new GLTFLoader();
        }

        if (params.calcCursorPosition) {
            this.addMouseMoveListener();
        }

        if (params.needScreenSize) {
            this.addScreenReSizeListener();
        }
        //初始化显示帧率的组件
        this.initStats();
        //适配屏幕尺寸
        this.handleResize();

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        //有些设备像素比很高，渲染会很费劲，所以需要限制最大值
        this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        // this.renderer.setPixelRatio(0.1);

        console.log("初始化后", this);

    }

    addScreenReSizeListener() {

        window.addEventListener("resize", (p) => {
            calc();
        });
        let calc = () => {

            if (!this.screenSize) {
                this.screenSize = new THREE.Vector2();
            }

            this.screenSize.set(window.innerWidth , window.innerHeight);

            this.handleResize();
        }

        calc();

    }

    addMouseMoveListener() {
        window.addEventListener("mousemove", (p) => {
            this.cursorPosition = new THREE.Vector2(p.clientX, p.clientY);
        });
    }

    initStats() {
        //实例化
        let stats = new Stats();
        //setMode参数如果是0，监测的是FPS信息，如果是1，监测的是渲染时间
        stats.setMode(0);
        //把统计面板放到左上角
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.left = '0px';
        //添加到body里
        document.body.appendChild(stats.domElement);
        this.stats = stats;
        console.log(stats,"sssssssssssss")
    }

    //适配屏幕尺寸
    handleResize() {
        try {
            // console.log("宽高",window.innerWidth , window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }catch (e) {
            console.log("适配尺寸报错了",e);
        }
    }

    initDebug() {
        this.dat = new dat.GUI({width: 300});
    }

    //手动重新渲染
    manualRender() {
        this.renderer.render(this.scene, this.camera);
    }

    destory(){
        console.log(this.dat.domElement.parentNode)
        this.dat.domElement.parentNode.removeChild(this.dat.domElement)
        this.dat.domElement.parentNode.removeChild(this.sta.domElement)
        // this.dat.destory();
    }
}