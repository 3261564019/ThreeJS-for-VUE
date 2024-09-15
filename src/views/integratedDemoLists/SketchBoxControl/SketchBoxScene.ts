import * as THREE from "three";
import {ACESFilmicToneMapping, AmbientLight, Clock, LoadingManager, SRGBColorSpace} from "three";
import {BaseInit, BaseInitParams} from "./core/baseInit";
import {WordPhysics} from "./physics/WordPhysics";
import {Character} from "./core/character";
import {SkyLight} from "./core/Sky/SkyLight";
import {WaterScene} from "./core/water/waterScene";
// import background from "@/assets/hdr/kloofendal_48d_partly_cloudy_puresky_1k.hdr?url"
import background from "@/assets/hdr/meadow_2_1k.hdr?url"
import school from "@/assets/model/display/school.glb?url"

import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export class SketchBoxScene extends BaseInit {
    physicsIns:WordPhysics
    clock:Clock
    loadMana:LoadingManager
    characterIns:Character
    skyLight: SkyLight;
    private waterIns: WaterScene;
    private debugData={
        far:1000,
        ratio:0.8,
        shadowMap:true,
        shadowType:"BasicShadowMap",
        renderTimeRatio:1,
        antialias:false,
        backgroundIntensity:5,
        backgroundBlurriness:0.2,
        toneMapping:THREE.ACESFilmicToneMapping,
        schoolPosition:{
            x:0,
            y:15,
            z:0
        }
    }

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
        this.dat.school=this.dat.addFolder('学校')

        //初始化资源加载管理器
        this.initLoadManager()
        //设置渲染器相机相关参数
        this.init();
        //创建物理世界
        this.physicsIns=new WordPhysics(this)
        this.characterIns=new Character(this)
        // this.skyLight=new SkyLight(this)
        // this.renderer.physicallyCorrectLights=true

        this.addDebug()
        this.clock=new Clock()
        this.addLight();
        Promise.all([
            this.characterIns.load(),
            this.physicsIns.load(),
            this.loadEnv(),
            this.loadSchool()
        ]).then((res)=>{
            console.log("加载到的",res)
            // @ts-ignore
            this.waterIns=new WaterScene(this,res[1])
            this.animate()
            // setInterval(()=>{this.animate()},1/60 * 1000)
            // this.skyLight.onceRender()
        })

    }
    addLight(){
        // this.scene.add(new AmbientLight("#fff",3))
    }
    loadEnv(){
        return new Promise(resolve => {
            new RGBELoader(this.loadMana).load(background, (texture) => {
                console.log("纹理对象", texture);
                texture.mapping = THREE.EquirectangularReflectionMapping;
                // texture.rotation.x=0.1;
                // texture.encoding = THREE.sRGBEncoding;
                this.scene.environment = texture;
                this.scene.background = texture;
                resolve(1)
            });
        })
    }
    loadSchool(){
        let loader = new GLTFLoader(this.loadMana)
        return new Promise((resolve, reject)=>{
            loader.load(school,(e)=>{
                console.log("学校",e)
                let s=e.scene

                s.traverse(e=>{
                    if(e.isMesh) {
                        e.material.side=THREE.FrontSide
                    }
                })
                s.position.set(9,15,12)

                let sNum=6
                s.scale.set(sNum,sNum,sNum)

                this.dat.school.add(this.debugData.schoolPosition,"x",-50,50,0.01).name("x").onChange((e:number)=>{
                  s.position.x=e;
                })
                this.dat.school.add(this.debugData.schoolPosition,"y",-50,50,0.01).name("y").onChange((e:number)=>{
                  s.position.y=e;
                })
                this.dat.school.add(this.debugData.schoolPosition,"z",-50,50,0.01).name("z").onChange((e:number)=>{
                  s.position.z=e;
                })


                this.scene.add(s)
                resolve(1)
            })
        })
    }
    addDebug(){

        this.dat.performance.add(this.debugData,"ratio",0.01,window.devicePixelRatio,0.01).name("像素比").onChange((e:number)=>{
            this.renderer.setPixelRatio(e);
        })

        this.dat.performance.add(this.debugData,'shadowMap').name("启用阴影").onChange(
            (e:boolean)=>{
                this.renderer.shadowMap.enabled = e;
            }
        )

        const toneMappingOptions = {
            None: THREE.NoToneMapping,
            Linear: THREE.LinearToneMapping,
            Reinhard: THREE.ReinhardToneMapping,
            Cineon: THREE.CineonToneMapping,
            ACESFilmic: THREE.ACESFilmicToneMapping,
            AgX: THREE.AgXToneMapping,
            Neutral: THREE.NeutralToneMapping,
            Custom: THREE.CustomToneMapping
        };
        this.dat.performance.add(this.debugData,'toneMapping', Object.keys( toneMappingOptions )).onChange( ()=> {
            this.renderer.toneMapping = toneMappingOptions[this.debugData.toneMapping];
        });
        // this.dat.performance.add(this.debugData,'antialias').name("抗锯齿").onChange(
        //     (e:boolean)=>{
        //         this.renderer.antialias = e;
        //     }
        // )
        // @ts-ignore
        this.scene.backgroundIntensity=1.9
        this.dat.performance.add(this.debugData,'renderTimeRatio',0.01,1.2).name("渲染时间比")
        this.dat.performance.add(this.debugData,'backgroundIntensity',0.01,400).name("背景光强度").onChange((e:number)=>{
            // @ts-ignore
            this.scene.backgroundIntensity=e*1;
        })

        this.dat.performance.add(this.debugData,'backgroundBlurriness',0.01,2).name("背景模糊度").onChange((e:number)=>{
            // @ts-ignore
            this.scene.backgroundBlurriness=e*1;
        })

        this.dat.performance.add(this.debugData, 'shadowType', ['BasicShadowMap', 'PCFShadowMap', 'PCFSoftShadowMap']).name('阴影类型').onChange((value:string) => {
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
        this.renderer.shadowMap.enabled = false;
        this.renderer.toneMapping=THREE.NoToneMapping
        this.renderer.outputColorSpace=SRGBColorSpace;
        // this.renderer.toneMappingExposure = 0.25;
        // this.renderer.shadowMap.type=THREE.PCFShadowMap
        THREE.ColorManagement.enabled = true;
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)
        this.camera.far=1000
        // let helper=new CameraHelper(this.camera)
        // this.scene.add(helper)
    }
    animate(){
        try {
            let delta=this.clock.getDelta()
            delta = Math.min(delta, 0.1);    // min 30 fps

            delta*=this.debugData.renderTimeRatio

            let elapsedTime=this.clock.getElapsedTime()
            this.renderer.render(this.scene, this.camera);

            //物理世界渲染前
            this.characterIns.physicsPreStep();
            this.physicsIns.render(delta,elapsedTime / 1000)
            this.characterIns.physicsPostStep()

            this.characterIns.render(delta,elapsedTime)
            this.waterIns.render(delta,elapsedTime)
            // this.skyLight.update()
            this.stats.update()

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
            // console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };
        this.loadMana.onError = function ( url ) {
            console.log( 'There was an error loading ' + url );
        };
    }
}