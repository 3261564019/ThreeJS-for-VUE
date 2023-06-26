import * as THREE from "three";
import {Clock, DirectionalLight, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import {CustomCoords, GMapIns} from "../types/Gmap";
import {ChildScene} from "../types";
import {RotationBox} from "./childScene/RotationBox";
import Stats from "three/examples/jsm/libs/stats.module";
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

    constructor(mapIns:GMapIns,center:number[],AMap:any) {
        this.mapIns=mapIns;
        this.customCoords = mapIns.customCoords;
        this.centerPosition = center;
        this.AMap = AMap;
        this.clock=new Clock();
        this.scene = new THREE.Scene();

        this.initCustomLayer();

        this.addLights();

        this.childScene.push(new RotationBox(this.scene,this.customCoords.lngLatsToCoords([
            [116.52, 39.79],
            [116.54, 39.79],
            [116.56, 39.79],
        ])));

        this.initStats();

        this.animate();

    }
    addLights(){
        // 环境光照和平行光
        let dLight = new DirectionalLight(0xffffff, 1);
        dLight.position.set(1000, -100, 900);
        this.scene.add(dLight);
    }
    /**
     *  初始化自定义图层,以及渲染器，相机，场景对象
     */
    initCustomLayer(){
        let GlLayer = new this.AMap.GLCustomLayer({
            // 图层的层级
            zIndex: 30,
            // 初始化的操作，创建图层过程中执行一次。
            init: (gl:any) => {
                // 这里我们的地图模式是 3D，所以创建一个透视相机，相机的参数初始化可以随意设置，因为在 render 函数中，每一帧都需要同步相机参数，因此这里变得不那么重要。
                // 如果你需要 2D 地图（viewMode: '2D'），那么你需要创建一个正交相机
                this.camera = new THREE.PerspectiveCamera(60, 500 / 500, 100, 1 << 30);

                this.renderer = new THREE.WebGLRenderer({
                    context: gl,  // 地图的 gl 上下文
                    // alpha: true,
                    // antialias: true,
                    // canvas: gl.canvas,
                });

                // 自动清空画布这里必须设置为 false，否则地图底图将无法显示
                this.renderer.autoClear = false;
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
                // 这里必须执行！！重新设置 three 的 gl 上下文状态。
                this.renderer.resetState();
            },
        });
        this.mapIns.add(GlLayer);
    }
    animate(){
        this.childScene.forEach(scene=>{
            scene.render(this.clock.getDelta(),this.clock.elapsedTime);
        })
        this.raf=requestAnimationFrame(this.animate.bind(this));
        this.stats.update()
        this.mapIns.render()
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
}