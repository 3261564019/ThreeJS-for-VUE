import * as THREE from "three";
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import school from "@/assets/model/display/school.glb?url"
// import school from "@/assets/model/display/school.gltf?url"
// import schoolGltf from "@/assets/model/display/school.gltf?url"
import clarens_night_02_4k from "@/assets/hdr/clarens_night_02_4k.hdr?url";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import gsap from "gsap";
import {FrontSide, Group, LoadingManager, Mesh, MeshStandardMaterial, PCFSoftShadowMap} from "three";
import {captureFont, captureLight, captureShrub, captureTrees} from "./util/SchoolModelPreprocessor";

export class BaseScene extends BaseInit {

    loader: GLTFLoader
    private loadManager: LoadingManager;
    debugParams = {
        PixelRatio: 1
    }

    constructor() {

        super({
            needLight: false,
            renderDomId: "#renderDom",
            needAxesHelper: true,
            needOrbitControls: true,
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.initResourceMange()

        this.loader = new GLTFLoader(this.loadManager);

        this.addLight();
        this.loadSceneBg()

        this.addModel();

        this.Debug()
    }

    Debug() {
        this.renderer.setPixelRatio(1);
        this.dat.add(this.debugParams, 'PixelRatio', 0.0, 3.0).onChange((value: string) => {
            // 根据选择的色调映射算法更新渲染器属性
            // @ts-ignore
            this.renderer.setPixelRatio(value * 1);
        }).name("像素比");

    }

    initResourceMange() {
        this.loadManager = new THREE.LoadingManager(   // Loaded
            () => {
                console.log('加载完成...')
            },
            // Progress
            (p) => {
                console.log('加载中...', p)
            });
    }

    addLight() {

        //创建聚光灯
        const light = new THREE.SpotLight("#fff",1);
        light.castShadow = true;            // default false
        light.position.x = 200;
        light.position.y = 200;
        this.scene.add(light);
    }

    loadSceneBg() {
        new RGBELoader(this.loadManager).load(clarens_night_02_4k, (texture) => {
            console.log("纹理对象", texture);

            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.encoding = THREE.sRGBEncoding;
            this.scene.environment = texture;
            this.scene.background = texture;

            this.animate()

        });
    }

    addModel(scene: Group, trees: Mesh[]) {

        this.loader.load(
            school,
            // called when the resource is loaded
            async (gltf) => {
                console.log("学校结果", gltf)

                //用于被重复的树实例
                let trees:Mesh[]=[]

                gltf.scene.traverse(v => {
                    let isMesh = v instanceof Mesh
                    let name:string = v.name

                    let doubleSide=["篮球网_Baked","立方体.015"]
                    if (doubleSide.includes(name)) {
                    } else {
                        if (isMesh) {
                            // @ts-ignore
                            v.material.side = FrontSide
                            // @ts-ignore
                            v.material.encoding = THREE.sRGBEncoding;

                            v.castShadow=true;
                            v.receiveShadow=true
                        }
                    }
                    if(name?.startsWith("treeIns")){
                        // @ts-ignore
                        trees.push(v)
                    }
                })


                captureTrees(gltf.scene, trees, this.scene)
                captureLight(gltf.scene, trees, this.scene)
                captureShrub(gltf.scene, trees, this.scene)
                await captureFont(gltf.scene, trees, this.scene)

                // gltf.scene.scale.set(5, 5, 5)

                for (let o=8; o<86; o+=8) {

                    for (let i = 1; i < 11; i++) {
                        let m = gltf.scene.clone();

                        m.position.setX(8 * i)
                        m.position.setZ(o)

                        m.position.x-=45;
                        m.position.z-=45;

                        if(i>8){
                            m.scale.set(2,2,2)
                            m.renderOrder = Number.MAX_SAFE_INTEGER;
                            m.traverse(function(child) {
                                if (child instanceof THREE.Mesh) {
                                    child.material=new MeshStandardMaterial({color:"#cccccc",depthTest:false})
                                }
                            });
                        }

                        this.scene.add(m);
                    }
                }

            }
        );
    }

    init() {
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.dat.add(this.renderer, 'toneMappingExposure', 0.0, 1.0).name("场景曝光")
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        // this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 30, 40);
        this.control.enableDamping=true
        this.renderer.shadowMap.type=PCFSoftShadowMap

        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)
    }

    animate() {
        this.stats.update()
        this.control.update();
        this.renderer.render(this.scene, this.camera);
        this.raf = requestAnimationFrame(this.animate.bind(this));

    }
}