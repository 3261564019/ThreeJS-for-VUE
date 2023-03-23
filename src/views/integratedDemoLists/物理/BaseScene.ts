import * as THREE from "three";
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import {usePhysics} from "./usePhysics";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import belfast_sunset_pure_sky_4k from "@/assets/hdr/belfast_sunset_puresky_4k.hdr?url";
import {Color, LoadingManager} from "three";
import {ChildScene, PhysicIns} from "./types";
import {PileRotation} from "./obstacles/PileRotation";


export class physicsBaseScene extends BaseInit {
    //物理模块
    private readonly physicsIns:PhysicIns;
    // @ts-ignore
    public loadManager:LoadingManager;
    // @ts-ignore
    private temp:MeshRigid;
    // @ts-ignore
    private childScene:Array<ChildScene>=[];

    constructor() {
        super({
            needLight: false,
            renderDomId: "#physicsBaseScene",
            needOrbitControls: true,
            needAxesHelper: true
        } as BaseInitParams);

        this.initDebug();

        this.initResourceMange()

        this.physicsIns= usePhysics(this);
        this.physicsIns.init({debug:false});

        this.loadSceneBg();

        this.addLight();
        //创建路径中所有的障碍
        this.initAllObstacles();

        this.startRender();

    }
    initAllObstacles(){
        let temp=new PileRotation(new THREE.Vector3(0,0,-60),new Color("#111111"),this,this.physicsIns);
        let temp1=new PileRotation(new THREE.Vector3(0,0,-100),new Color("#222222"),this,this.physicsIns);
        this.childScene.push(temp)
        this.childScene.push(temp1)
    }
    initResourceMange() {
        // let that=this;
        this.loadManager = new LoadingManager(
            () => {
                console.log('加载完成', this);
            },
            // Progress
            (p) => {
                console.log("加载中",p)
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

    addLight() {
        const light = new THREE.DirectionalLight( 0xaabbff, 1 );
        light.position.x = 0;
        light.position.y = 150;
        light.position.z = - 50;
        this.scene.add(light);
    }

    startRender() {

        this.renderer.shadowMap.enabled = true;

        const clock = new THREE.Clock();

        // @ts-ignore
        const animate = () => {
            let delta=clock.getDelta();

            this.stats.update()
            this.raf = requestAnimationFrame(animate);
            this.renderer?.render(this.scene, this.camera);
            this.physicsIns?.render(delta);
            //渲染子场景
            for(let i=0;i<this.childScene.length;i++){
                this.childScene[i].render(delta,clock.elapsedTime);
            }
        }

        animate();

        // setInterval(animate,1000/60)
    }
}