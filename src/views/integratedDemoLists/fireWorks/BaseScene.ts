import {
    ACESFilmicToneMapping, BufferAttribute, BufferGeometry,
    DoubleSide, Float32BufferAttribute,
    Mesh,
    MeshLambertMaterial,
    PlaneGeometry, Points, PointsMaterial, ShaderChunk, ShaderMaterial,
    SpotLight, SpriteMaterial, Uniform
} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import vertex from "./vertex.glsl"
import fragment from "./fragment.glsl"
import * as THREE from "three";

export class BaseScene extends BaseInit {
    private m: ShaderMaterial;
    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            needAxesHelper:false,
            adjustScreenSize:true,
            renderDomId:"#renderDom"
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.addPlan();

        this.addLight();

        this.createFireWork(100);

        this.animate()
    }
    extraOnReSize() {
        console.log("aaa",this.screenSize)
        console.log(this.m?.uniforms)
    }

    createFireWork(count:number){
        let position=new Float32Array(count*3);

        let radius=1;
        for(let i=0;i<count;i++){

            let p=i*3;

            position[p]=Math.random()*radius-(radius/2);
            position[p+1]=Math.random()*radius-(radius/2);
            position[p+2]=Math.random()*radius-(radius/2);
        }
        const geometry = new BufferGeometry();

        geometry.setAttribute('position', new Float32BufferAttribute(position, 3));

        console.log(position);

        console.log(geometry);


        let v=vertex.replace("///logdepthbuf_pars_vertex",ShaderChunk.logdepthbuf_pars_vertex)
        v=v.replace("///logdepthbuf_vertex",ShaderChunk.logdepthbuf_vertex)

        let f=fragment.replace("///logdepthbuf_pars_fragment",ShaderChunk.logdepthbuf_pars_fragment)
        f=f.replace("///logdepthbuf_fragment",ShaderChunk.logdepthbuf_fragment)

        const material = new ShaderMaterial({
            vertexShader:v,
            fragmentShader:f,
            uniforms:{
                uSize:new Uniform(10),
                uResolution:new Uniform(this.screenSize)
            }
        });

        this.m=material;
        
        const fireWorks=new Points(geometry,material);

        this.scene.add(fireWorks);
    }
    addPlan(){

        const geometry = new PlaneGeometry(1, 1);
        const material = new MeshLambertMaterial({color: 0x222222});
        material.side=DoubleSide
        const plane = new Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true

        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        //添加地板容器
        this.scene.add(plane);

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
        this.camera.position.set(0, 0, 3);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)


        const axesHelper = new THREE.AxesHelper(1);
        this.scene.add(axesHelper);

    }
    animate(){

        this.control.update()
        this.stats.update()
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }
}