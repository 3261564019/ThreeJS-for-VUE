import * as THREE from "three";
import {BaseInit, BaseInitParams} from "./core/baseInit";
import {WordPhysics} from "./physics/WordPhysics";
import {AmbientLight, CameraHelper, Clock, Color, LoadingManager} from "three";
import {Character} from "./core/character";
import {SkyLight} from "./core/Sky/SkyLight";
import {WaterScene} from "./core/water/waterScene";

export class SketchBoxScene extends BaseInit {
    physicsIns:WordPhysics
    clock:Clock
    loadMana:LoadingManager
    characterIns:Character
    skyLight: SkyLight;
    private waterIns: WaterScene;

    constructor() {
        super({
            renderDomId:"#renderDom",
            needDebug:true,
            needStats:true,
            needOrbitControls:false,
            needAxesHelper:false,
            adjustScreenSize:true
        } as BaseInitParams);

        this.dat.performance=this.dat.addFolder('性能')

        //初始化资源加载管理器
        this.initLoadManager()
        //设置渲染器相机相关参数
        this.init();
        //创建物理世界
        this.physicsIns=new WordPhysics(this)
        this.characterIns=new Character(this)
        this.skyLight=new SkyLight(this)

        this.renderer.physicallyCorrectLights=true

        this.addDebug()
        this.clock=new Clock()

        Promise.all([
            this.characterIns.load(),
            this.physicsIns.load()
        ]).then((res)=>{
            console.log("加载到的",res)
            // @ts-ignore
            this.waterIns=new WaterScene(this,res[1])
            this.animate()
            this.skyLight.onceRender()
        })

    }
    addDebug(){
        let p={
            far:1000,
            ratio:0.8,
            shadowMap:true,
            shadowType:"BasicShadowMap"
        }

        this.dat.performance.add(p,"ratio",0.01,window.devicePixelRatio,0.01).name("像素比").onChange((e:number)=>{
            this.renderer.setPixelRatio(e);
        })

        this.dat.performance.add(p,'shadowMap').name("启用阴影").onChange(
            (e:boolean)=>{
                this.renderer.shadowMap.enabled = e;
            }
        )

        this.dat.performance.add(p, 'shadowType', ['BasicShadowMap', 'PCFShadowMap', 'PCFSoftShadowMap']).name('阴影类型').onChange((value:string) => {
            switch(value) {
                case 'BasicShadowMap':
                    this.renderer.shadowMap.type = THREE.BasicShadowMap;
                    break;
                case 'PCFShadowMap':
                    this.renderer.shadowMap.type = THREE.PCFShadowMap;
                    break;
                case 'PCFSoftShadowMap':
                    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                    break;
                default:
                    // 默认设置为 BasicShadowMap
                    this.renderer.shadowMap.type = THREE.BasicShadowMap;
                    break;
            }
        });
    }
    init() {

        this.renderer.setPixelRatio(0.8);
        this.renderer.shadowMap.type=THREE.PCFShadowMap
        this.renderer.shadowMap.enabled = true;
        // this.renderer.toneMappingExposure = 0.25;
        // this.renderer.shadowMap.type=THREE.PCFShadowMap
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)
        this.camera.far=1000
        // let helper=new CameraHelper(this.camera)
        // this.scene.add(helper)
    }
    animate(){
        try {
            let delta=this.clock.getDelta()
            delta = Math.min(delta, 1 / 10);    // min 30 fps
            let elapsedTime=this.clock.getElapsedTime()
            this.renderer.render(this.scene, this.camera);
            this.stats.update()
            this.physicsIns.render(delta,elapsedTime)
            this.characterIns.render(delta,elapsedTime)
            this.waterIns.render(delta,elapsedTime)
            // this.skyLight.update()
            requestAnimationFrame(this.animate.bind(this));
        }catch (e) {
            // @ts-ignore
            console.log("图像渲染报错",e)
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