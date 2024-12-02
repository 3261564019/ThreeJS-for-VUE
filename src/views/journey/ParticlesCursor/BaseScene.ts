import {
    ACESFilmicToneMapping, AdditiveBlending, AxesHelper, BufferGeometry,
    DoubleSide, Float32BufferAttribute,
    Mesh,
    MeshLambertMaterial,
    PlaneGeometry, Points, ShaderMaterial,
    SpotLight, Uniform
} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import frag from "./frag.glsl"
import vertex from "./vertex.glsl"
import dog from "@/assets/img/dog.webp"
import {CanvasDraw} from "@/views/journey/ParticlesCursor/CanvasDraw";
export class BaseScene extends BaseInit {
    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            needAxesHelper:false,
            transparentRenderBg:true,
            needTextureLoader:true,
            adjustScreenSize:true,
            renderDomId:"#renderDom"
        } as BaseInitParams);


        new CanvasDraw();

        this.initDebug();

        this.init();

        this.addPlan();

        this.animate()
    }
    addPlan(){

        const geometry = new PlaneGeometry(40, 40,148,148);


        let points_m=new ShaderMaterial({
            vertexShader:vertex,
            fragmentShader:frag,
            uniforms: {
                uSize: new Uniform(1),
                uT1:{value:this.textureLoader.load(dog)},
                uResolution: new Uniform(this.screenSize),
            },

            depthTest:true,
            depthWrite: false,     // 禁止透明部分写入深度缓冲区
            // blending:AdditiveBlending,
            transparent:true
        });


        let points=new Points(geometry,points_m);

        //添加地板容器
        this.scene.add(points);

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

        this.scene.add(new AxesHelper(10));

        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.9;
        this.control.enableDamping=true;
        this.control.dampingFactor = 0.08;
        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 0, 45);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

    }
    animate(){

        this.control.update()
        this.stats.update()
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }
}