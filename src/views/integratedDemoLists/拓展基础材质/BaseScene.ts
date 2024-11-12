import {
    ACESFilmicToneMapping, Clock, Color,
    DoubleSide,
    Mesh, MeshBasicMaterial, MeshDepthMaterial,
    MeshLambertMaterial, MeshPhysicalMaterial, MeshStandardMaterial,
    PlaneGeometry, RGBADepthPacking,
    SpotLight, SpotLightHelper, Texture
} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import * as THREE from "three";
import clarens_night_02_4k from "@/assets/hdr/clarens_night_02_4k.hdr?url";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import man from "@/assets/model/LeePerrySmith/man.glb?url"
export class BaseScene extends BaseInit {
    private envMap: Texture;

    private m:MeshStandardMaterial;
    private depth:MeshDepthMaterial=new MeshDepthMaterial({
        depthPacking:RGBADepthPacking
    });

    private debugData={
        twistLevel:0.9
    }

    private clock=new Clock();

    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            needAxesHelper:true,
            renderDomId:"#renderDom"
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.renderer.setClearColor(new Color("#222222"));

        this.addLight();
        // this.loadEnv();
        this.animate()

        this.addDebug();
        this.addPlan();
        this.loadModal();
        // this.addPlan();
    }
    loadEnv(){
        new RGBELoader().load(clarens_night_02_4k, (texture) => {
            console.log("纹理对象", texture);

            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.encoding = THREE.sRGBEncoding;
            this.envMap=texture
            // this.scene.environment = texture;
            this.scene.background = texture;
        });
    }
    loadModal(){
        let loader = new GLTFLoader()
        loader.load(man, (e) => {
            //@ts-ignore
            // console.log("模型加载结果", e.scene.children[0].material)

            e.scene.traverse(v=>{
                v.receiveShadow=true;
                v.castShadow=true
            })


            e.scene.scale.set(2,2,2);
            e.scene.position.setZ(11);
            e.scene.position.setY(2);
            //@ts-ignore
            e.scene.children[0].material=this.changeMaterial(e.scene.children[0].material);
            e.scene.children[0].customDepthMaterial=this.depth;
            // e.scene.children[0].material=this.depth;
            //@ts-ignore
            this.m=e.scene.children[0].material;

            this.captureMaterial()

            this.scene.add(e.scene);
        })
    }
    changeMaterial(physicalMaterial:MeshPhysicalMaterial){

        // 创建一个新的 MeshStandardMaterial
        const standardMaterial = new MeshStandardMaterial({
            color: physicalMaterial.color,
            map: physicalMaterial.map,
            roughness: physicalMaterial.roughness,
            metalness: physicalMaterial.metalness,
            normalMap: physicalMaterial.normalMap,
            emissive: physicalMaterial.emissive,
            emissiveMap: physicalMaterial.emissiveMap,
            emissiveIntensity: physicalMaterial.emissiveIntensity,
            aoMap: physicalMaterial.aoMap,
            aoMapIntensity: physicalMaterial.aoMapIntensity,
            envMap: physicalMaterial.envMap,
            envMapIntensity: physicalMaterial.envMapIntensity,
            displacementMap: physicalMaterial.displacementMap,
            displacementScale: physicalMaterial.displacementScale,
            displacementBias: physicalMaterial.displacementBias,
            roughnessMap: physicalMaterial.roughnessMap,
            metalnessMap: physicalMaterial.metalnessMap,
            opacity: physicalMaterial.opacity,
            transparent: physicalMaterial.transparent,
            side: physicalMaterial.side,
            // 其他属性根据需要添加
        });
        physicalMaterial.dispose()
        // 替换材质
        return standardMaterial;

    }
    captureMaterial(){

        // 将 shader.uniforms 赋值给 material，以便在外部更新 uniform 值
        this.m.onBeforeCompile=(e,a)=>{
            e.uniforms.uTime={value:0};
            e.uniforms.twistLevel={value:0};
            this.m.userData.shaderUniforms = e.uniforms;

            e.vertexShader=e.vertexShader.replace("#include <common>",`
            
            uniform float uTime;
            uniform float twistLevel;

            #include <common>
                mat2 get2dRotateMatrix(float angle){
                    return mat2(cos(angle),- sin(angle),sin(angle),cos(angle));
                }
            `)

            e.vertexShader=e.vertexShader.replace("#include <beginnormal_vertex>",`
                #include <beginnormal_vertex>
                
                float angle=position.y * twistLevel; 
                angle=angle + uTime; 
                mat2 rotateMatrix=get2dRotateMatrix(angle);
                    
                objectNormal.xz=rotateMatrix * objectNormal.xz;
                
            `);


            e.vertexShader=e.vertexShader.replace("#include <begin_vertex>",`
                #include <begin_vertex>
                  
                transformed.xz=rotateMatrix * transformed.xz;
            `)
            console.log("材质",this.m)

            // console.log(e.vertexShader,a)
        }

        this.depth.onBeforeCompile=(e,a)=> {
            console.log(e);
            e.uniforms.uTime={value:0};
            e.uniforms.twistLevel={value:0};

            this.depth.userData.shaderUniforms = e.uniforms;

            e.vertexShader=e.vertexShader.replace("#include <common>",`
            
            uniform float uTime;
            uniform float twistLevel;

            #include <common>
                mat2 get2dRotateMatrix(float angle){
                    return mat2(cos(angle),- sin(angle),sin(angle),cos(angle));
                }
            `)
            e.vertexShader=e.vertexShader.replace("#include <begin_vertex>",`
                #include <begin_vertex>
                
                  float angle=position.y * twistLevel;
                angle=angle + uTime; 
                
                mat2 rotateMatrix=get2dRotateMatrix(angle);
                
                transformed.xz=rotateMatrix * transformed.xz;
                
            `);
        }
    }
    addPlan(){

        const geometry = new PlaneGeometry(40, 40);
        const material = new MeshStandardMaterial({color:"#eee"});
        material.side=DoubleSide
        const plane = new Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true
        plane.material.envMap=this.envMap;
        plane.position.x = 0;
        plane.position.y = -7;
        plane.position.z = 0;

        //添加地板容器
        this.scene.add(plane);

    }
    addLight(){

        //创建聚光灯
        const light = new SpotLight("#fff",3000);
        light.castShadow = true;            // default false
        light.position.x = 10;
        light.position.y = 18;
        light.position.z = 40;



        this.scene.add(light);
        this.scene.add(new SpotLightHelper(light));
    }
    init() {
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.9;
        this.control.enableDamping=true;
        this.control.dampingFactor = 0.08;
        this.renderer.shadowMap.enabled = true;

        let t={
            "x": -10.6678971925377,
            "y": 0.6460303411616156,
            "z": 34.372294421035114
        }

        this.camera.position.set(t.x, t.y, t.z);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

        
        this.dat.add(this.debugData,"twistLevel",0,5).name("扭曲程度")

        this.clock.start();
    }
    animate(){
        if(this.m?.userData?.shaderUniforms){
            this.m.userData.shaderUniforms.twistLevel.value = this.debugData.twistLevel;
            this.m.userData.shaderUniforms.uTime.value =this.clock.getElapsedTime();
            // this.m.uniforms.uTIme.value=this.clock.getElapsedTime();
        }
        if(this.depth?.userData?.shaderUniforms) {

            this.depth.userData.shaderUniforms.uTime.value = this.clock.getElapsedTime();
            this.depth.userData.shaderUniforms.twistLevel.value = this.debugData.twistLevel;

        }
        this.control.update()
        this.stats.update()
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }
    getPosition(){
        console.log(this.camera.position)
    }
    private addDebug() {
        this.dat.add(this,"getPosition").name("相机位置");
    }
}