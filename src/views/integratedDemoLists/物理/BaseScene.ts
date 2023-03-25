import * as THREE from "three";
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import {usePhysics} from "./usePhysics";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import belfast_sunset_pure_sky_4k from "@/assets/hdr/belfast_sunset_puresky_4k.hdr?url";
import {Color, DirectionalLightHelper, LoadingManager, Vector3} from "three";
import {ChildScene, MeshRigid, PhysicIns} from "./types";
import {PileRotation} from "./obstacles/PileRotation";
import {PlanerBasePlane} from "./mainScene/PlanerBasePlane";
import {AddBaseWallsMesh} from "./mainScene/addBaseWallsMesh";
import {RectAreaLightHelper} from "three/examples/jsm/helpers/RectAreaLightHelper";


export class physicsBaseScene extends BaseInit {
    //物理模块
    private readonly physicsIns:PhysicIns;
    // @ts-ignore
    public loadManager:LoadingManager;
    private childScene:Array<ChildScene>=[];

    constructor() {
        super({
            needLight: false,
            renderDomId: "#physicsBaseScene",
            renderBg:"#1f232b",
            needOrbitControls: true,
            needAxesHelper: true,
            adjustScreenSize:true
        } as BaseInitParams);

        this.initDebug();
        //初始化资源加载器
        this.initResourceMange()
        //创建物理世界
        this.physicsIns= usePhysics(this);
        this.physicsIns.init({debug:true});
        //加载场景背景
        // this.loadSceneBg();
        //添加灯光
        this.addLight();
        //创建路径中所有的障碍 球体基础背景以及其他子场景
        this.initAllBaseScene();
        new AddBaseWallsMesh(this);
    }
    initAllBaseScene(){
        let temp=[
            new PlanerBasePlane(this,new Vector3(0,0,-20)),
            new PileRotation(new THREE.Vector3(0,0,-60),new Color("#111111"),this,this.physicsIns),
            new PileRotation(new THREE.Vector3(0,0,-100),new Color("#222222"),this,this.physicsIns),
            ]
        temp.map(v=>{
            this.childScene.push(v)
        })
    }
    initResourceMange() {
        // let that=this;
        this.loadManager = new LoadingManager(
            () => {
                console.log('加载完成', this);
                this.startRender();

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




        const width = 44;
        const height = 380;
        const intensity = 1;
        const rectLight = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
        rectLight.position.set( 0, 50, -140);
        rectLight.lookAt( 0, 0, 0 );
        this.scene.add( rectLight )

        let rectLightHelper = new RectAreaLightHelper( rectLight );
        this.scene.add( rectLightHelper );
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