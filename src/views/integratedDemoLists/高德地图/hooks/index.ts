import * as THREE from "three";
import {Clock, DirectionalLight, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import {CustomCoords, GMapIns, MakerWithCmp} from "../types/Gmap";
import {ChildScene} from "../types";
import {RotationBox} from "./childScene/RotationBox";
import Stats from "three/examples/jsm/libs/stats.module";
import {ShiningWall} from "./childScene/ShiningWall";
import {CustomLabelRender} from "./renders/customLabelRender";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import {createApp} from "vue";
import testCpn from "../../../../components/test.vue";
export class GMapRender {
    private camera: PerspectiveCamera;
    private renderer: WebGLRenderer;
    private scene: Scene;
    //高德地图实例
    private mapIns: any;
    //AMapLoader.load 加载出来的结果
    private AMap: any;
    private customCoords:CustomCoords
    //地图中心点经纬度
    private readonly centerPosition:number[]
    //RequestAnimationFrame的key
    private raf:number
    //子场景
    private childScene: ChildScene[]=[]
    private clock: Clock;
    private stats: Stats;
    private labelRender:CustomLabelRender


    constructor(mapIns:GMapIns,center:number[],AMap:any) {
        this.mapIns=mapIns;
        this.customCoords = mapIns.customCoords;
        this.centerPosition = center;
        this.AMap = AMap;
        this.clock=new Clock();
        this.scene = new THREE.Scene();

        this.initCustomLayer().then(()=>{
            //创建标签渲染器
            let dom=document.querySelector(".amap-layers");
            this.labelRender=new CustomLabelRender({scene:this.scene,camera:this.camera,zIndex:'10',parentDom:dom});

            this.childScene.push(new RotationBox(this.scene,mapIns,this,[116.38694633457945,39.927013807253026]));
            this.childScene.push(new RotationBox(this.scene,mapIns,this,[116.38731111500547,39.92411765068325]));
            this.childScene.push(new RotationBox(this.scene,mapIns,this,[116.38731111500547,39.92411765068325]));
            this.childScene.push(new RotationBox(this.scene,mapIns,this,[116.38922353003309,39.92581257536286],50));

            this.childScene.push(new ShiningWall({scene:this.scene,mapIns,renderIns:this,wallPath:[
                    [116.38694633457945,39.927013807253026],
                    [116.39100183460997,39.92691507665982],
                    [116.39065851185606,39.92410119489807],
                    [116.38731111500547,39.92411765068325],
                    [116.38694633457945,39.927013807253026],
                ],color:"#FFD500"}))

            this.animate();

        })

        this.addLights();

        this.initStats();

    }
    addLights(){
        // 环境光照和平行光
        let dLight = new DirectionalLight(0xffffff, 1);
        dLight.position.set(1000, -100, 900);
        this.scene.add(dLight);
    }
    /**
     *  初始化自定义图层,以及渲染器，相机
     */
    initCustomLayer(){
        return new Promise(resolve => {
            let GlLayer = new this.AMap.GLCustomLayer({
                // 图层的层级 默认为 120
                zIndex: 10,
                //图层缩放等级范围，默认 [2, 20]
                zooms:[2,20],
                // 初始化的操作，创建图层过程中执行一次。
                init: (gl:any) => {


                    // 这里我们的地图模式是 3D，所以创建一个透视相机，相机的参数初始化可以随意设置，因为在 render 函数中，每一帧都需要同步相机参数，因此这里变得不那么重要。
                    // 如果你需要 2D 地图（viewMode: '2D'），那么你需要创建一个正交相机
                    this.camera = new THREE.PerspectiveCamera(60, 500 / 500, 100, 1 << 30);
                    this.renderer = new THREE.WebGLRenderer({
                        context: gl,  // 地图的 gl 上下文
                        // logarithmicDepthBuffer:true,
                        alpha: true,
                        depth:true,
                        antialias: false,
                        // canvas: gl.canvas,
                    });



                    // 自动清空画布这里必须设置为 false，否则地图底图将无法显示
                    this.renderer.autoClear = false;
                    // this.renderer.setDepthTest(true);
                    //设置HDR显示效果 这个属性用于在普通计算机显示器或者移动设备屏幕等低动态范围介质上，模拟、逼近高动态范围（HDR）效果。
                    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
                    //场景曝光以及亮度
                    // this.renderer.toneMappingExposure = 0.6;

                    // this.renderer.outputEncoding = THREE.sRGBEncoding;
                    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));


                    resolve(null)

                },
                render: () => {
                    // 这里必须执行！！重新设置 three 的 gl 上下文状态。
                    this.renderer.resetState();
                    // 重新设置图层的渲染中心点，将模型等物体的渲染中心点重置
                    // 否则和 LOCA 可视化等多个图层能力使用的时候会出现物体位置偏移的问题
                    this.customCoords.setCenter(this.centerPosition);
                    // @ts-ignore
                    let {near, far, fov, up, lookAt, position} = this.customCoords.getCameraParams();
                    // 2D 地图下使用的正交相机
                    // var { near, far, top, bottom, left, right, position, rotation } = customCoords.getCameraParams();
                    // 这里的顺序不能颠倒，否则可能会出现绘制卡顿的效果。
                    this.camera.near = near;
                    this.camera.far = far;
                    this.camera.fov = fov;
                    // @ts-ignore
                    this.camera.position.set(...position);
                    // @ts-ignore
                    this.camera.up.set(...up);
                    // @ts-ignore
                    this.camera.lookAt(...lookAt);
                    this.camera.updateProjectionMatrix();
                    // 2D 地图使用的正交相机参数赋值
                    // camera.top = top;
                    // camera.bottom = bottom;
                    // camera.left = left;
                    // camera.right = right;
                    // camera.position.set(...position);
                    // camera.updateProjectionMatrix();
                    this.renderer.render(this.scene, this.camera);

                    this.renderer.resetState();
                },
            });
            this.mapIns.add(GlLayer);
        })
    }
    animate(){
        this.childScene.forEach(scene=>{
            scene.render(this.clock.getDelta(),this.clock.elapsedTime);
        })
        this.stats.update()
        this.mapIns.render()
        this.labelRender?.render(this.scene, this.camera)
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }
    initStats() {
        //实例化
        // @ts-ignore
        this.stats = new Stats();
        //setMode参数如果是0，监测的是FPS信息，如果是1，监测的是渲染时间
        this.stats.setMode(0);
        //把统计面板放到左上角
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        this.stats.domElement.style.left = '0px';
        //添加到body里
        document.body.appendChild(this.stats.domElement);
    }
    destroy() {
        try {
            cancelAnimationFrame(this.raf);
            // @ts-ignore
            this.stats.domElement.parentNode.removeChild(this.stats.domElement);
            this.renderer.forceContextLoss();
            this.renderer.dispose();
            this.scene.clear();
            // @ts-ignore
            this.scene = null;
            // @ts-ignore
            this.camera = null;
            // @ts-ignore
            this.renderer = null;
            // @ts-ignore
            // window.removeEventListener("resize",this.reSizeCallBack);
            // window.removeEventListener("mousemove",this.mouseMove);
        } catch (e) {
            console.log(e)
        }
    }
    //打开自定义的信息窗体
    openInfoWindow(ins?:MakerWithCmp) {
        if(!ins){
            throw "openInfoWindow 参数为空"
        }

        ins.state="opening"

        // @ts-ignore
        let p=this.customCoords.lngLatsToCoords([ins.marker._position])

        console.log(ins);

        let dom=document.createElement("div");
        // @ts-ignore
        dom.id="info-window-" +ins.marker._amap_id;

        document.body.appendChild(dom);
        let cmpIns=createApp(ins.cmp).mount(dom)
        console.log(cmpIns)

        const label = new CSS2DObject(dom);

        // @ts-ignore
        cmpIns.setData({rootElementId:dom.id,destroy:()=>{
                this.scene.remove(label)
                ins.state=null
                console.log("移除完成")
            }})
        // @ts-ignore
        label.position.set(p[0][0],p[0][1],0);
        this.scene.add(label)
    }
    /**
     * 将经纬度转换为 three.js 的坐标
     * @param arr  [[116.38,39.92]]
     * @return
     */
    latLongToPosition(arr:Array<number[]>){
       return  this.mapIns.customCoords.lngLatsToCoords(arr)
    }
}