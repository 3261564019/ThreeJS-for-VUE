import {PerspectiveCamera, Scene, WebGLRenderer} from "three";
import * as THREE from "three";
// @ts-ignore
import Stats from 'stats-js';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// @ts-ignore
import * as dat from 'dat.gui';
import {debounce} from "../../../../utils";
export interface BaseInitParams {
    //是否需要坐标指示器
    needStats?: boolean;
    needAxesHelper?: boolean,
    //渲染器的背景色
    renderBg?: string,
    //是否需要初始化好OrbitControls
    needOrbitControls?: boolean,
    //渲染器背景透明
    transparentRenderBg?: boolean,
    //渲染到指定节点的id 将被直接用于 querySelector
    renderDomId: string,
    //是否需要实时计算鼠标位置，并存储在cursorPosition
    calcCursorPosition?: boolean
    //是否适配屏幕尺寸。适应
    adjustScreenSize?: Boolean
    //是否初始化dat.gui
    needDebug?: Boolean
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
    //当前鼠标在屏幕可视区的位置x和y取值在屏幕宽高之间
    // @ts-ignore
    public cursorPosition: THREE.Vector2
    //屏幕宽高
    // @ts-ignore
    public screenSize: THREE.Vector2
    // @ts-ignore
    public reSizeCallBack:Function;

    constructor(params: BaseInitParams = {
        calcCursorPosition:false,
        needAxesHelper: false,
        renderBg: "#282c34",
        needOrbitControls: true,
        transparentRenderBg: false,
        adjustScreenSize: false,
        renderDomId: '#webGl',
        needDebug:true
    }) {

        const scene = new THREE.Scene();
        //创建相机对象  可视范围常用（45-75）  长宽比 近截面（near）和远截面（far）。 当物体某些部分比摄像机的远截面远或者比近截面近的时候，该这些部分将不会被渲染到场景中。
        const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1200);
        // 创建挂载器
        const renderer = new THREE.WebGLRenderer({
            //开启抗锯齿
            antialias: true,
            logarithmicDepthBuffer:true,
        });
        renderer.physicallyCorrectLights=true
        //获取挂载节点
        let dom=document.querySelector(params.renderDomId)
        if(dom){
            dom.appendChild(renderer.domElement);
        }else{
            console.error("渲染dom不存在")
        }

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
        // renderer.toneMapping = THREE.NeutralToneMapping;
        //场景曝光以及亮度
        renderer.toneMappingExposure = 1;
        //outputColorSpace定义渲染器的输出编码。默认为THREE.SRGBColorSpace
        // renderer.outputEncoding=THREE.LinearEncoding;

        //创建三维坐标系坐标
        if (params.needAxesHelper) {
            const axesHelper = new THREE.AxesHelper(1.83);
            scene.add(axesHelper);
        }


        //创建相机对象
        camera.position.set(0, 0, 100);
        camera.lookAt(0, 0, 0);

        scene.add(camera);


        if (params.needOrbitControls) {
            this.control = new OrbitControls(camera, renderer.domElement);
        }

        if (params.calcCursorPosition) {
            this.addMouseMoveListener();
        }

        if (params.adjustScreenSize) {
            // @ts-ignore
            this.addScreenReSizeListener(dom);
        }

        if(params.needStats){
            this.initStats();
        }

        if(params.needDebug){
            this.initDebug();
        }

        //适配屏幕尺寸
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        //有些设备像素比很高，渲染会很费劲，所以需要限制最大值
        this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    }
    //屏幕尺寸发生变化时进行适配，并存储可视区域宽高，用于计算射线
    addScreenReSizeListener(dom: Element) {

        let calc=()=>{

            let w=dom.clientWidth;
            let h=dom.clientHeight;

            if (!this.screenSize) {
                this.screenSize = new THREE.Vector2();
            }

            this.screenSize.set(w , h);
            this.handleResize(w,h);
        }
        calc();
        this.reSizeCallBack=debounce(calc,1000,this);
        // @ts-ignore
        window.addEventListener("resize", this.reSizeCallBack);
    }
    mouseMove(p:MouseEvent){
            this.cursorPosition = new THREE.Vector2(p.clientX, p.clientY);
    }
    addMouseMoveListener() {
        window.addEventListener("mousemove", this.mouseMove);
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
    }
    //适配屏幕尺寸
    handleResize(w:number,h:number) {
        try {
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        }catch (e) {
            // @ts-ignore
            console.log("适配尺寸报错",e.message);
        }
    }
    private initDebug() {
        this.dat = new dat.GUI({width: 400});
    }
    destroy(){
        try {
            this.dat?.destroy()
            this.renderer.forceContextLoss();
            this.renderer.dispose();
            this.scene.clear();
            // @ts-ignore
            window.removeEventListener("resize",this.reSizeCallBack);
            window.removeEventListener("mousemove",this.mouseMove);
            // @ts-ignore
            this.scene = null;
            // @ts-ignore
            this.camera = null;
            // @ts-ignore
            this.renderer = null;
            this.stats.domElement.parentNode.removeChild(this.stats.domElement);
        }catch (e) {
            // @ts-ignore
            console.log("释放资源时报错",e.message)
        }
    }
}
