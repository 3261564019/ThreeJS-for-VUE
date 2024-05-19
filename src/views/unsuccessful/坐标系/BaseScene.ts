import {
    ACESFilmicToneMapping, BoxGeometry,
    DoubleSide,
    LinearEncoding,
    Mesh,
    MeshLambertMaterial,
    PlaneGeometry,
    SpotLight
} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";

export class BaseScene extends BaseInit {

    private plane: Mesh<PlaneGeometry, MeshLambertMaterial>
    box: Mesh<BoxGeometry, MeshLambertMaterial>;

    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            needAxesHelper:true,
            renderDomId:"#renderDom"
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.addPlan();

        this.addLight();


        this.animate()
    }
    addPlan(){

        const geometry = new PlaneGeometry(10, 10);
        const material = new MeshLambertMaterial({color: 0x222222});
        material.side=DoubleSide
        const plane = new Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true
        plane.rotateX(Math.PI/2)
        plane.position.x = 10;
        plane.position.y = 0;
        plane.position.z = 0;

        let box=new Mesh(new BoxGeometry(3,3),new MeshLambertMaterial({color:"#f00"}))
        plane.add(box)
        box.position.x=-2;
        this.plane=plane
        this.box=box
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
        this.renderer.outputEncoding = LinearEncoding;
        this.control.enableDamping=true;
        this.control.dampingFactor = 0.08;
        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 0, 60);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

    }
    animate(){

        // this.plane.position.x+=0.01;

        this.control.update()
        this.stats.update()
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }
}