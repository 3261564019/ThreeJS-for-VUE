import * as THREE from "three";
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
// @ts-ignore
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import belfast_sunset_pure_sky_4k from "@/assets/hdr/belfast_sunset_puresky_4k.hdr?url";
import {
    Color,
    DirectionalLight,
    DirectionalLightHelper,
    LoadingManager,
    SpotLight,
    SpotLightHelper,
    Vector3
} from "three";
import {ChildScene, MeshRigid, PhysicIns} from "./types";
import {PileActionType, PileAnimation} from "./obstacles/PileAnimation";
import {PlanerBasePlane} from "./mainScene/PlanerBasePlane";
import {AddBaseWallsMesh} from "./mainScene/addBaseWallsMesh";
import {RectAreaLightHelper} from "three/examples/jsm/helpers/RectAreaLightHelper";
import {MoveWall} from "./obstacles/MoveWall";
import {WaterPool} from "./obstacles/WaterPool";
import {usePhysics} from "./usePhysics";


export class physicsBaseScene extends BaseInit {
    //物理模块
    private readonly physicsIns:PhysicIns;
    // @ts-ignore
    public loadManager:LoadingManager;
    private childScene:Array<ChildScene>=[];
    // @ts-ignore
    public spotLight: SpotLight;

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
        // this.initAllBaseScene();
        // new AddBaseWallsMesh(this);
    }
    initAllBaseScene(){
        let temp=[
            new PlanerBasePlane(this,new Vector3(0,0,-20)),
            new PileAnimation(new THREE.Vector3(0,0,-60),new Color("#2D2D30"),new Color("#e50012"),this,this.physicsIns,PileActionType.RotationAtCenter),
            new MoveWall(new THREE.Vector3(0,0,-100),new Color("#002ea6"),new Color("#e33915"),this,this.physicsIns,0),
            // new WaterPool(new THREE.Vector3(0,0,-100),this,this.physicsIns,0),
            new PileAnimation(new THREE.Vector3(0,0,-140),new Color("#3D3B4F"),new Color("#e50012"),this,this.physicsIns,PileActionType.UpAndDown),
            new MoveWall(new THREE.Vector3(0,0,-180),new Color("#E6755F"),new Color("#e33915"),this,this.physicsIns,1.2),
            new PileAnimation(new THREE.Vector3(0,0,-220),new Color("#C21F30"),new Color("#e50012"),this,this.physicsIns,PileActionType.RotationAtCenter),
            new MoveWall(new THREE.Vector3(0,0,-260),new Color("#789262"),new Color("#e33915"),this,this.physicsIns,2.4),
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
        const light = new THREE.SpotLight( "#fff" ,1); // soft white light
        light.position.set(180,180,-150);
        light.lookAt(0,0,-160)
        light.castShadow=true;
        this.scene.add( light );
        this.spotLight=light;
        this.scene.add( new SpotLightHelper(light));
        {
            const light = new THREE.AmbientLight( "#fff" ,0.4); // soft white light
            this.scene.add( light );
        }
    }

    startRender() {
        this.renderer.shadowMap.enabled = true;
        // this.renderer.physicallyCorrectLights = true ;
        // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // renderer.toneMapping = THREE.ACESFilmicToneMapping
// 渲染器将允许多少光线进入
//         renderer.toneMappingExposure = 3
        // this.dat.add(this.renderer,"toneMapping")
        // this.dat.add(this.renderer,"toneMappingExposure").min(0).max(10)

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
    destroy() {
        super.destroy();
        this.physicsIns.destroy()
    }
}