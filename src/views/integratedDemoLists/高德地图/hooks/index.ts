import * as THREE from "three";
import {AmbientLight, CameraHelper, Clock, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import {CustomCoords, GMapIns, MakerWithCmp, SetDataParams} from "../types/Gmap";
import {ChildScene} from "../types";
import {RotationBoxScene} from "./childScene/RotationBoxScene";
import {ShiningWall} from "./childScene/ShiningWall";
import {CustomLabelRender} from "./renders/customLabelRender";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import {createApp} from "vue";
// @ts-ignore
import * as dat from 'dat.gui';
// @ts-ignore
import Stats from 'stats-js';
import {FlowPath} from "./childScene/FlowPath";

/*
 * 构造自定义图层的参数
 */
export interface GMapMakerParams {
    // 高德地图实例
    mapIns: GMapIns
    //中心点的经纬度[]
    center: number[]
    //加载出来的对象
    AMap: any
    //地图容器id
    AMapDomId: string
}

export class GMapRender {
    private camera: PerspectiveCamera;
    private renderer: WebGLRenderer;
    private scene: Scene;
    //高德地图实例
    private readonly mapIns: any;
    //AMapLoader.load 加载出来的结果
    private AMap: any;
    private customCoords: CustomCoords
    //地图中心点经纬度
    private readonly centerPosition: number[]
    //RequestAnimationFrame的key
    private raf: number
    //子场景
    private childScene: ChildScene[] = []
    //正方体旋转
    private boxScene:RotationBoxScene
    private clock: Clock;
    private stats: Stats;
    private labelRender: CustomLabelRender
    private p: GMapMakerParams
    private dat: any


    constructor(p: GMapMakerParams) {
        this.p = p;
        this.mapIns = p.mapIns;
        this.customCoords = p.mapIns.customCoords;
        this.centerPosition = p.center;
        this.AMap = p.AMap;
        this.clock = new Clock();
        this.scene = new THREE.Scene();
        this.dat = new dat.GUI({width: 300});

        this.boxScene=new RotationBoxScene(this.scene,p.mapIns,this);

        this.initCustomLayer().then(() => {
            //创建标签渲染器
            let dom = document.querySelector(".amap-layers");
            this.labelRender = new CustomLabelRender({
                scene: this.scene,
                camera: this.camera,
                zIndex: '10',
                parentDom: dom
            });

             let temp=[
                 [116.38694633457945, 39.927013807253026],
                 [116.38731111500547, 39.92411765068325],
                 [116.38731111500547, 39.92411765068325],
                 [116.38922353003309, 39.92581257536286],
             ];

             temp.forEach(v=>{
                 this.boxScene.addBox(v)
             })

            const minLatitude = 39.9;  // 最小纬度
            const maxLatitude = 40.0;  // 最大纬度
            const minLongitude = 116.3;  // 最小经度
            const maxLongitude = 116.4;  // 最大经度

            // 循环添加对象
            for (let i = 0; i < 2000; i++) {
                // 随机生成经纬度
                const latitude = Math.random() * (maxLatitude - minLatitude) + minLatitude;
                const longitude = Math.random() * (maxLongitude - minLongitude) + minLongitude;
                // 将对象添加到
                this.boxScene.addBox([longitude, latitude])

            }

            this.childScene.push(new ShiningWall({
                scene: this.scene, mapIns: p.mapIns, renderIns: this, wallPath: [
                    [116.38694633457945, 39.927013807253026],
                    [116.39100183460997, 39.92691507665982],
                    [116.39065851185606, 39.92410119489807],
                    [116.38731111500547, 39.92411765068325],
                    [116.38694633457945, 39.927013807253026],
                ], color: "#FFD500"
            }))


            this.childScene.push(new FlowPath({
                renderIns: this,
                scene: this.scene,
                mapIns: this.mapIns,
                path: [
                    [116.3840388200073, 39.925380620387735],
                    [116.38922353003309, 39.92581257536286],
                    [116.39296521160887, 39.92600592575559],
                ],
                height: [20, 330, 80],
                size: 20,
                speed: 220
            }))

            this.animate();

        })

        this.addLights();

        this.initStats();

    }

    addLights() {
        // 环境光照和平行光
        let dLight = new AmbientLight(0xffffff, 1);
        // dLight.position.set(1000, -100, 900);
        this.scene.add(dLight);

        // this.dat.add(dLight,"itensity",-10,10);
    }

    /**
     *  初始化自定义图层,以及渲染器，相机
     */
    initCustomLayer() {
        return new Promise(resolve => {
            let GlLayer = new this.AMap.GLCustomLayer({
                // 图层的层级 默认为 120
                zIndex: 120,
                //图层缩放等级范围，默认 [2, 20]
                zooms: [2, 20],
                // 初始化的操作，创建图层过程中执行一次。
                init: (gl: any) => {


                    // 这里我们的地图模式是 3D，所以创建一个透视相机，相机的参数初始化可以随意设置，因为在 render 函数中，每一帧都需要同步相机参数，因此这里变得不那么重要。
                    // 如果你需要 2D 地图（viewMode: '2D'），那么你需要创建一个正交相机
                    this.camera = new THREE.PerspectiveCamera(60, 500 / 500, 100, 1 << 30);
                    // this.camera.near =100
                    // this.camera.far =500
                    this.renderer = new THREE.WebGLRenderer({
                        context: gl,  // 地图的 gl 上下文
                        // logarithmicDepthBuffer:true,
                        alpha: true,
                        depth: false,
                        antialias: false,
                        // canvas: gl.canvas,
                        logarithmicDepthBuffer:true
                    });

                    this.renderer.outputEncoding=THREE.LinearEncoding;
                    this.renderer.toneMappingExposure=1;
                    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;

                    // this.dat.add(this.camera,"near",-300,300).onChange(()=>{
                    //     console.log("变")
                    //     this.camera.updateProjectionMatrix();
                    // })
                    // this.dat.add(this.camera,"far",-300,300).onChange(()=>{
                    //     console.log("变")
                    //     this.camera.updateProjectionMatrix();
                    // })

                    this.resize();

                    this.scene.add(new CameraHelper(this.camera))

                    // 自动清空画布这里必须设置为 false，否则地图底图将无法显示
                    this.renderer.autoClear = false;
                    // this.renderer.setDepthTest(true);
                    //设置HDR显示效果 这个属性用于在普通计算机显示器或者移动设备屏幕等低动态范围介质上，模拟、逼近高动态范围（HDR）效果。
                    // this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
                    //场景曝光以及亮度
                    // this.renderer.toneMappingExposure =1;

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
                    this.camera.near = near/20;
                    this.camera.far = far/20;
                    // this.camera.near = near;
                    // this.camera.far = far;
                    // console.log("near: " + near + " far: " + far);
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

    animate() {
        for (let i = 0; i < this.childScene.length; i++) {
            this.childScene[i].render(this.clock.getDelta(), this.clock.elapsedTime);
        }
        this.boxScene?.render(this.clock.getDelta(), this.clock.elapsedTime)
        this.stats?.update()
        this.mapIns.render()
        this.labelRender?.render(this.scene, this.camera)
        this.raf = requestAnimationFrame(this.animate.bind(this));
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
    openInfoWindow(ins?: MakerWithCmp) {
        if (!ins) {
            throw new Error("openInfoWindow 参数为空")
        }
        //将该对象的状态置为打开状态
        ins.state = "opening"
        //将经纬度转为坐标 @ts-ignore
        let p = this.customCoords.lngLatsToCoords([ins.marker._position])
        //创建组件需要挂载的dom
        let dom = document.createElement("div");
        // @ts-ignore
        dom.id = "info-window-" + ins.marker._amap_id;
        dom.style.position = 'fixed'
        let renderRoot = document.querySelector("#labelRenderer")
        if (!renderRoot) {
            throw new Error("labelRenderer 没获取到！！！");
        }
        renderRoot.appendChild(dom);
        //创建出组件对象
        let cmp = createApp(ins.component);
        //挂载完拿到组件实例
        let cmpIns = cmp.mount(dom)
        const label = new CSS2DObject(dom);
        //窗体的销毁函数
        let destroy = () => {
            // 从场景中移除对象
            this.scene.remove(label)
            //卸载组件
            cmp.unmount()
            // @ts-ignore
            cmp = null
            // @ts-ignore
            cmpIns = null
            //重置状态以便下次打开
            ins.state = null
        }
        //引用给到外部，方便调用
        ins.close = destroy
        /*
            1、调用组件暴露出来的方法设置附加数据
            2、传入销毁函数便于组件内部自己关闭
         */
        //@ts-ignore
        cmpIns.setData({
            data: ins.additionalData,
            destroy
        } as SetDataParams)
        // @ts-ignore
        label.position.set(p[0][0], p[0][1], 0);
        this.scene.add(label)
    }

    /**
     * 将经纬度转换为 three.js 的坐标
     * @param arr  [[116.38,39.92]]
     * @return position [[x,y]]
     */
    latLongToPosition(arr: Array<number[]>) {
        return this.mapIns.customCoords.lngLatsToCoords(arr)
    }

    //调整显示范围的显示比例,需要自己防抖
    resize() {
        let dom = document.getElementById(this.p.AMapDomId);
        if (dom) {
            let t = {w: dom.offsetWidth, h: dom.offsetHeight};
            this.camera.aspect = t.w / t.h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(t.w, t.h);

            console.log(this.labelRender, "sssss")
            this.labelRender?.labelRenderer.setSize(t.w, t.h);
        }
    }
}
