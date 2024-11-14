import {
    ACESFilmicToneMapping, AdditiveBlending, AnimationMixer, Clock, Color,
    DoubleSide,
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

    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            transparentRenderBg:true,
            needAxesHelper:false,
            renderDomId:"#renderDom"
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.initMaterial();

        this.addBall();

        this.loadSuSan();

        this.addTorus();

        // this.addLight();

        this.animate()


    }
    initMaterial(){

        let v=vertex.replace("//logdepthbuf_pars_vertex",ShaderChunk.logdepthbuf_pars_vertex)
        v=v.replace("//logdepthbuf_vertex",ShaderChunk.logdepthbuf_vertex)

        let f=fragment.replace("//logdepthbuf_pars_fragment",ShaderChunk.logdepthbuf_pars_fragment)
        f=f.replace("//logdepthbuf_fragment",ShaderChunk.logdepthbuf_fragment)

        this.m=new ShaderMaterial({
            vertexShader:v,
            fragmentShader:f,
            transparent:true,
            side:DoubleSide,
            depthWrite:false,
            blending:AdditiveBlending,
            uniforms:{
                uTime:new Uniform(0),
                uColor:new Uniform(new Color("#0084ff"))
            }
        })

        this.uniforms=this.m.uniforms;

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
            t.position.set(9,0,0)
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

        this.scene.add(light);
    }
    init() {

        this.clock=new Clock();
        this.clock.start();
        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.9;
        this.control.enableDamping=true;
        this.control.dampingFactor = 0.08;
        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(-5, 10, 18);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

    }
    animate(){
        this.objs.forEach(t=>{
            // t.rotation.y+=0.01
            // t.rotation.x+=0.01
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