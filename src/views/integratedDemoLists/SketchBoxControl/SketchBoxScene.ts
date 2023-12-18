import * as THREE from "three";
import {BaseInit, BaseInitParams} from "./core/baseInit";
import {WordPhysics} from "./physics/WordPhysics";
import {Clock, Color, LoadingManager} from "three";
import {Character} from "./core/character";

export class SketchBoxScene extends BaseInit {
    physicsIns:WordPhysics
    clock:Clock
    loadMana:LoadingManager
    characterIns:Character

    constructor() {
        super({
            renderDomId:"#renderDom",
            needDebug:true,
            needStats:true,
            needOrbitControls:true,
            adjustScreenSize:true
        } as BaseInitParams);
        //初始化资源加载管理器
        this.initLoadManager()
        //设置渲染器相机相关参数
        this.init();
        //创建物理世界
        this.physicsIns=new WordPhysics(this)
        this.characterIns=new Character(this)

        Promise.all([
            this.characterIns.load(),
        ]).then(()=>{
            this.animate()
        })

        this.addPlan();
        this.addLight();
        this.addBall();
        this.clock=new Clock()
    }
    addPlan(){

        const geometry = new THREE.PlaneGeometry(40, 40);
        const material = new THREE.MeshLambertMaterial({color:new Color("#aaa")});
        material.side=THREE.DoubleSide
        const plane = new THREE.Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        //添加地板容器
        this.scene.add(plane);

    }
    addLight(){

        //创建聚光灯
        const light = new THREE.SpotLight("#fff");
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

        sphere.position.x = 10;
        sphere.position.y = 3;
        sphere.castShadow = true

        this.scene.add(sphere);
    }
    init() { 
        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 30, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)
    }
    animate(){
        try {
            let delta=this.clock.getDelta()
            let elapsedTime=this.clock.getElapsedTime()
            this.control.update()
            this.renderer.render(this.scene, this.camera);
            this.stats.update()
            this.physicsIns.render(delta,elapsedTime)
            this.characterIns.render(delta,elapsedTime)

            requestAnimationFrame(this.animate.bind(this));
        }catch (e) {
            // @ts-ignore
            console.log("图像渲染报错",e.message)
        }
    }
    destroy() {
        super.destroy();
        this.physicsIns.destroy()
    }

    private initLoadManager() {
        this.loadMana=new LoadingManager()
        this.loadMana.onStart = function ( url, itemsLoaded, itemsTotal ) {
            console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };

        this.loadMana.onLoad =()=>{
            console.log( 'Loading complete!');


        };

        this.loadMana.onProgress = function ( url, itemsLoaded, itemsTotal ) {
            console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };

        this.loadMana.onError = function ( url ) {
            console.log( 'There was an error loading ' + url );
        };
    }
}