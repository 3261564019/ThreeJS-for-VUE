import {
    ACESFilmicToneMapping, AdditiveBlending, Color,
    DoubleSide,
    Mesh,
    MeshLambertMaterial, Object3DEventMap,
    PlaneGeometry, Points, ShaderMaterial, SphereGeometry,
    SpotLight, Uniform
} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";

export class BaseScene extends BaseInit {
    private material: ShaderMaterial;
    private points: Points<SphereGeometry, ShaderMaterial, Object3DEventMap>;
    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            needAxesHelper:true,
            transparentRenderBg:true,
            adjustScreenSize:true,
            renderDomId:"#renderDom"
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.addBall();

        this.addLight();

        this.animate()
    }
    addBall(){

        const geometry = new SphereGeometry(3, 32,32    );
        this.material=new ShaderMaterial({
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
        let points=new Points(geometry,this.material);
        this.points=points
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

        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.9;
        this.control.enableDamping=true;
        this.control.dampingFactor = 0.08;
        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 0, 60);
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