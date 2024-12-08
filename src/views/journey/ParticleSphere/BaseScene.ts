import {
    ACESFilmicToneMapping, AdditiveBlending, BufferGeometry,
    DoubleSide, Float32BufferAttribute,
    Mesh,
    MeshLambertMaterial,
    PlaneGeometry, Points, ShaderMaterial, SphereGeometry,
    SpotLight, Uniform
} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import fragment from "./fragment.glsl?raw"
import vertex from "./vertex.glsl?raw"
import p from "@/assets/model/ParticleMesh/particle.glb?url"
export class BaseScene extends BaseInit {

    geometrys:BufferGeometry[]=[];
    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            needAxesHelper:true,
            adjustScreenSize:true,

            needGLTFLoader:true,
            transparentRenderBg:true,
            renderDomId:"#renderDom"
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.loadModel();
        // this.addBall();

        this.addLight();

        this.animate()
    }
    addPointsByGeometry(i:number){

         let geometry=this.geometrys[i];
         geometry.setIndex(null)
         let material=new ShaderMaterial({
             vertexShader:vertex,
             fragmentShader:fragment,
             uniforms:{
                 uResolution: new Uniform(this.screenSize),
             },

             transparent:true,
             depthTest:true,
             depthWrite: false,     // 禁止透明部分写入深度缓冲区
             blending:AdditiveBlending
         })
        // const geometry = new PlaneGeometry(30, 30,148,148);



        let points=new Points(geometry,material);

         this.scene.add(points);
         // this.scene.add(new Mesh(geometry,material))

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

        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.9;
        this.control.enableDamping=true;
        this.control.dampingFactor = 0.08;
        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 3, 3);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

    }
    animate(){

        this.control.update()
        this.stats.update()
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }

    private loadModel() {
        this.gltfLoader.load(p,(e)=>{
            console.log(e.scene.children)

            let max=0;

            let res:Float32BufferAttribute[]=[]

            let positions=e.scene.children.map(v=>{
                //@ts-ignore
                let t=v.geometry.attributes.position
                console.log(v.name+"\t"+t.count);
                if(t.count>max){
                    max=t.count;
                }
                return t
            })

            //
            for (const position of positions) {
                //如果頂點数不够就在已有的定点列表随机出来进行重复
                const vertices = new Float32Array(max*3)
                position.array.forEach((v,i)=>{
                    vertices[i]=position.array[i]
                })
                if(position.count<max){
                    let t=(max-position.count)*position.itemSize;
                    console.log("差了"+t);
                    for (let i = 0; i < t; i++) {
                        vertices[position.array.length+i]=0;
                    }
                }else{

                }
                res.push(new Float32BufferAttribute(vertices,3))
            }

            res.forEach(e=>{
                let t=new BufferGeometry();
                t.setAttribute("position",e);
                this.geometrys.push(t)
            })


            this.addPointsByGeometry(2);

            // console.log(max)
            // console.log(positions)

            // this.scene.add(e.scene)
        })
    }
}