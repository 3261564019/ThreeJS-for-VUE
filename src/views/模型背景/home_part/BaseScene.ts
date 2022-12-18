
import * as THREE from "three";
import gsap from 'gsap';
import {Renderer, Scene, PerspectiveCamera, SpotLightHelper, Vector2, SpotLight, Clock} from "three";
import {debounce} from "../../../utils";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export class Part1Scene{

    renderDom:HTMLBaseElement;
    renderer:Renderer
    camera:PerspectiveCamera;
    scene:Scene;
    cursorPosition:Vector2
    light:SpotLight
    control:OrbitControls

    constructor({renderDomId}) {
        this.cursorPosition=new Vector2();
        this.renderDom=document.querySelector(renderDomId);
        this.init();
        // this.addControl();
        this.reSize();
        this.startRender();
        this.loadModel();
        this.mouseMove();
    }
    addControl(){

        const control=new OrbitControls(this.camera, this.renderer.domElement);
        control.enableDamping=true;
        control.enableZoom=false;
        //x轴鼠标移动的区间
        control.maxAzimuthAngle=1.3
        control.minAzimuthAngle=-1.3
        //
        control.maxPolarAngle=1.3;
        control.minPolarAngle=0;

        this.control=control;
    }
    mouseMove(){
        window.addEventListener("pointermove",(event)=>{
            let canvas = this.renderDom.children[0];
            let getBoundingClientRect = canvas.getBoundingClientRect();
            let x = ((event.clientX - getBoundingClientRect.left) / canvas.offsetWidth) * 2 - 1;
            let y = -((event.clientY - getBoundingClientRect.top) / canvas.offsetHeight) * 2 + 1;

            if(!Number.isNaN(x) && !Number.isNaN(y)){
            // if (isNumber(x) && isNumber(y)) {
                this.cursorPosition.set(x, y);
                // console.log("位置",this.cursorPosition);
            // }
            }
        })
    }
    loadModel(){
        new GLTFLoader().load("http://qrtest.qirenit.com:81/share/img/cemetery_angel_-_fisher/scene.gltf",
            (res) => {
                console.log("场景",res);

                let s=res.scene;

                res.scene.traverse(v=>{
                    v.receiveShadow=true;
                    v.castShadow=true;
                    if(v instanceof THREE.Mesh){
                        v.material.map.magFilter = THREE.LinearFilter
                        v.material.map.minFilter  = THREE.LinearMipMapLinearFilter
                        v.material.side = THREE.FrontSide;

                        // console.log("图形对象=====",v.material.map);
                    }
                })

                s.scale.set(10,12,10);
                this.scene.add(s)
        })
    }
    reSize(){
        const callback=()=>{
            console.log(this.renderDom.offsetWidth)
            let p={
                w:this.renderDom.offsetWidth,
                h:this.renderDom.offsetHeight
            }
            this.renderer.setSize(p.w,p.h);
        }
        window.addEventListener("resize",debounce(callback,100));
        callback();
    }
    startRender(){

        let delta=0;
        const clock=new Clock();
        const animate = () => {
            delta=clock.getDelta()

            requestAnimationFrame(animate);

            if(this.light){

                //相机组要移动的目的地是当前鼠标偏移量[-0.5 ~ 0.5]的10倍
                let target=new THREE.Vector2(this.cursorPosition.x * 100,this.cursorPosition.y * 100);
                //每次移动的距离是剩余距离的1/10
                this.light.position.x+=(target.x - this.light.position.x) * delta *4;
                this.light.position.y+=(target.y - this.light.position.y) * delta *4;
            }
            if(this.control){
                this.control.update();
            }

            this.renderer.render(this.scene, this.camera);
        }

        animate();
    }
    init() {


        const scene = new THREE.Scene();

        const renderer = new THREE.WebGLRenderer({
            //开启抗锯齿
            antialias: true,
            logarithmicDepthBuffer:true
        });
        renderer.shadowMap.enabled=true;
        // renderer.setClearColor(new THREE.Color("#ccc"))
        //设置HDR显示效果 这个属性用于在普通计算机显示器或者移动设备屏幕等低动态范围介质上，模拟、逼近高动态范围（HDR）效果。
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        //场景曝光以及亮度
        renderer.toneMappingExposure = 0.6;

        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.setClearAlpha(0);

        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        this.renderDom.appendChild(renderer.domElement);

        const camera = new THREE.PerspectiveCamera(50, 1, 0.3, 2000);
        camera.position.set(0, 0, 100);
        camera.lookAt(0, 0, 0);




        const light = new THREE.SpotLight("#fff");
        light.intensity=1;
        light.angle=0.5;
        light.shadow.camera.near =10;
        light.shadow.camera.far = 1000;
        light.castShadow = true;            // default false
        light.position.set(0, 0, 70);
        const targetObject = new THREE.Object3D();
        targetObject.position.set(0,10,0)
        scene.add(targetObject);
        light.target = targetObject;
        this.light=light;
        // const lh=new SpotLightHelper(light);

        // const helper = new THREE.CameraHelper( light.shadow.camera );
        // scene.add(lh)
        // scene.add(helper)


        const axesHelper = new THREE.AxesHelper(20);


        // scene.add(axesHelper);
        scene.add(light);
        scene.add(camera);

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

    }
}