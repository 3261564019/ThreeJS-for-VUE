import {
    ACESFilmicToneMapping,
    DoubleSide,
    Mesh,
    MeshLambertMaterial,
    PlaneGeometry, Points, ShaderMaterial, SphereGeometry,
    SpotLight
} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import fragment from "./fragment.glsl?raw"
import vertex from "./vertex.glsl?raw"

export class BaseScene extends BaseInit {
    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            needAxesHelper:true,
            renderDomId:"#renderDom"
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.addBall();

        this.addLight();

        this.animate()
    }
    addBall(){

         // let geometry=new SphereGeometry(10,10,10);

         let material=new ShaderMaterial({
             vertexShader:vertex,
             fragmentShader:fragment,
         })
        const geometry = new PlaneGeometry(30, 30,148,148);



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