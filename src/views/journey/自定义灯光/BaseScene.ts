import {
    ACESFilmicToneMapping, AdditiveBlending, AnimationMixer, Clock, Color,
    DoubleSide, FrontSide,
    Mesh, MeshBasicMaterial,
    MeshLambertMaterial,
    PlaneGeometry, ShaderChunk, ShaderMaterial, SphereGeometry,
    SpotLight, TorusKnotGeometry, Uniform
} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {captureBoxMan} from "@/views/integratedDemoLists/SketchBoxControl/hooks/mesh/character";
import susan from "@/assets/model/display/susan.glb?url"
import vertex from "./vertex.glsl?raw"
import fragment from "./fragment.glsl?raw"


export class BaseScene extends BaseInit {

    objs:Mesh[]=[]

    uniforms:any;
    m:ShaderMaterial;
    private clock: Clock;
    debugData={
        uColor: "#fff",
        specular:28,
        planeColor:"#0077ff",
        pointColor:"#8eff00",
        pointColor1:"#ff284d",
        PlaneLightStrength:1,
        specularMode:2
    }

    planeM:MeshBasicMaterial;

    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            transparentRenderBg:true,
            needAxesHelper:false,
            renderDomId:"#renderDom"
        } as BaseInitParams);

        super.initDebug();

        this.init();

        this.initMaterial();

        this.addHelper()
        this.addDebug();

        this.addBall();

        this.loadSuSan();

        this.addTorus();

        // this.addLight();

        this.animate()
    }
    addHelper(){
        let addDirectionHelper=()=>{
            const geometry = new PlaneGeometry(2, 2);
            const m=new MeshBasicMaterial({color:this.debugData.planeColor})
            m.side=DoubleSide
            this.planeM=m;

            const plane = new Mesh(geometry, m);
            plane.position.set(0,0,10)
            plane.lookAt(0,0,0)
            this.scene.add(plane);
        }

        let addPointLightHelper1=()=>{
            const geometry = new SphereGeometry(0.5, 32,32);
            const m=new MeshBasicMaterial({color:"#fff"})
            m.side=DoubleSide
            const plane = new Mesh(geometry, m);
            plane.position.set(-5,2,-4)
            plane.lookAt(0,0,0)
            this.scene.add(plane);
        }
        let addPointLightHelper2=()=>{
            const geometry = new SphereGeometry(0.5, 32,32);
            const m=new MeshBasicMaterial({color:"#fff"})
            m.side=DoubleSide
            const plane = new Mesh(geometry, m);
            plane.position.set(5,2,-4)
            plane.lookAt(0,0,0)
            this.scene.add(plane);
        }

        addDirectionHelper()
        addPointLightHelper1()
        addPointLightHelper2()
    }
    initMaterial(){

        let v=vertex.replace("//logdepthbuf_pars_vertex",ShaderChunk.logdepthbuf_pars_vertex)
        v=v.replace("//logdepthbuf_vertex",ShaderChunk.logdepthbuf_vertex)

        let f=fragment.replace("//logdepthbuf_pars_fragment",ShaderChunk.logdepthbuf_pars_fragment)
        f=f.replace("//logdepthbuf_fragment",ShaderChunk.logdepthbuf_fragment)

        this.m=new ShaderMaterial({
            vertexShader:v,
            fragmentShader:f,
            transparent:false,
            side:FrontSide,
            // blending:AdditiveBlending,
            uniforms:{
                uTime:new Uniform(0),
                uColor:new Uniform(new Color("#ffffff")),
                uPlaneLightColor:new Uniform(new Color(this.debugData.planeColor)),
                uPointLightColor:new Uniform(new Color(this.debugData.pointColor)),
                uPointLightColor1:new Uniform(new Color(this.debugData.pointColor1)),
                uPlaneLightStrength:new Uniform(this.debugData.PlaneLightStrength),
                uSpecular:new Uniform(this.debugData.specular),
                uSpecularMode:new Uniform(this.debugData.specularMode)
            }
        })

        this.uniforms=this.m.uniforms;

    }
    addDebug(){
        console.log(this.uniforms)
        this.dat.addColor(this.debugData,"uColor").onChange(
            ()=>{
                this.m.uniforms.uColor.value.set(this.debugData.uColor);
            }
        ).name("物体颜色");

        let folder=this.dat.addFolder("方向灯");

        folder.add(this.debugData,"PlaneLightStrength",0,10,0.1).onChange((e)=>{
            this.m.uniforms.uPlaneLightStrength.value=e
        })
        folder.addColor(this.debugData,"planeColor").onChange(
            ()=>{
                this.m.uniforms.uPlaneLightColor.value.set(this.debugData.planeColor);
            }
        ).name("方向灯颜色");

        let point=this.dat.addFolder("点光源");
        point.addColor(this.debugData,"pointColor").onChange(
            ()=>{
                this.m.uniforms.uPointLightColor.value.set(this.debugData.pointColor);
            }
        ).name("颜色左");
        point.addColor(this.debugData,"pointColor1").onChange(
            ()=>{
                this.m.uniforms.uPointLightColor1.value.set(this.debugData.pointColor1);
            }
        ).name("颜色右");


        this.dat.add(this.debugData,"specular",1,60,0.01).name("镜面程度").onChange(v=>{
            this.m.uniforms.uSpecular.value=v
        })

        this.dat.add(this.debugData,"specularMode",{
            "单纯加法":1,
            "高光程度*光的颜色":2
        }).name("高光模式").onChange(v=>{
            this.m.uniforms.uSpecularMode.value=v
        })
    }
    loadSuSan(){
        const loader = new GLTFLoader();
        loader.load(susan,(res)=>{
            console.log("模型对象res",res)

            let t=res.scene

            t.traverse(v=>{
                if(v instanceof  Mesh){
                    v.material=this.m
                }
            })

            let s=3;
            t.scale.set(s,s,s);
            this.scene.add(t)
            //@ts-ignore
            this.objs.push(t)
        })
    }
    addTorus(){
        const geometry = new TorusKnotGeometry( 10, 3, 100, 16 );
        const torusKnot = new Mesh( geometry, this.m );
        let s=0.2;
        torusKnot.scale.set(s,s,s)
        torusKnot.position.set(9,0,0)

        this.scene.add( torusKnot );
        this.objs.push(torusKnot)

    }
    addBall(){

        const geometry = new SphereGeometry(2, 40);
        const plane = new Mesh(geometry, this.m);
        //设置接受阴影
        plane.receiveShadow = true

        plane.position.x = -8;
        plane.position.y = 0;
        plane.position.z = 0;

        //添加地板容器
        this.scene.add(plane);
        this.objs.push(plane)

    }
    addLight(){

        //创建聚光灯
        const light = new SpotLight("#fff");
        light.castShadow = true;            // default false
        light.position.x = 20;
        light.position.y = 30;

        // this.scene.add(light);
    }
    init() {

        this.clock=new Clock();
        this.clock.start();
        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.control.enableDamping=true;
        this.control.dampingFactor = 0.08;
        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(-5, 10, 18);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

    }
    animate(){
        this.objs.forEach(t=>{
            t.rotation.y+=0.01
            t.rotation.x+=0.01
        })

        if(this.uniforms){
            this.uniforms.uTime.value=this.clock.getElapsedTime();
        }

        this.control.update()
        this.stats.update()
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }
}