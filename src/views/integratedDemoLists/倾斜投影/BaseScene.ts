import * as THREE from "three";
import gsap from 'gsap';
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import {B3DMLoader, TilesRenderer} from '3d-tiles-renderer';
import {Group, LoadingManager} from "three";
import temp from "@/data/tileset.json"
export class BaseScene extends BaseInit {

    TilesGroup:Group
    private tilesRenderer: TilesRenderer;
    constructor() {
        super({
            renderDomId:"#renderDom",
            needLight:false,
            needOrbitControls:true
        } as BaseInitParams);

        this.TilesGroup=new Group();

        this.scene.add(this.TilesGroup);

        this.initDebug();

        this.init();

        this.addPlan();

        this.addLight();

        this.addBall();

        this.loadTiles();
    }
    addPlan(){

        const geometry = new THREE.PlaneGeometry(40, 40);
        const material = new THREE.MeshLambertMaterial({color: 0xeeeeee});
        material.side=THREE.DoubleSide
        const plane = new THREE.Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        //添加地板容器
        this.scene.add(plane);

    }
    loadTiles(){

        console.log("ttt",temp)

        this.tilesRenderer = new TilesRenderer("/src/data/tileset.json");

        console.log("渲染器",this.tilesRenderer.group)

        this.tilesRenderer.setCamera( this.camera );
        this.tilesRenderer.setResolutionFromRenderer( this.camera, this.renderer );

        this.tilesRenderer.group.scale.set(0.1,0.1,0.1)

        this.tilesRenderer.group.position.set(-20,0,0);
        this.scene.add( this.tilesRenderer.group );
    }
    addLight(){

        //创建聚光灯
        const light = new THREE.SpotLight("#fff");
        light.castShadow = true;            // default false
        light.position.x = 20;
        light.position.y = 30;

        this.scene.add(light);
    }
    addBall(){

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(3, 33, 33),
            new THREE.MeshLambertMaterial({color: "#fff"})
        );

        sphere.position.x = 10;
        sphere.position.y = 3;
        sphere.castShadow = true

        this.scene.add(sphere);
    }
    init() {

        this.renderer.shadowMap.enabled = true;

        this.camera.position.set(0, 30, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

        // const clock = new THREE.Clock();

        const animate = () => {

            this.stats.update()

            this.raf=requestAnimationFrame(animate);

            this.tilesRenderer?.update();
            this.renderer.render(this.scene, this.camera);
        }

        animate();

    }
}