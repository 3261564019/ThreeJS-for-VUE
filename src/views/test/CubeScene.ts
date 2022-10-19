
import * as THREE from "three";
import gsap from 'gsap';
import {BaseInit, BaseInitParams} from "../../three/classDefine/baseInit";

export class CubeScene extends BaseInit {
    cube:THREE.Mesh
    constructor() {
        super({
            needLight: false,
            needOrbitControls: true,
            renderDomId:"#cubeDemo"
        } as BaseInitParams);

        this.initDebug();

        this.init();

        // this.addPlan();

        this.addLight();

        // this.addBall();
        this.addCube();
    }
    addCube(){
        const geometry = new THREE.BoxGeometry( 8, 8, 8 );
        const material = new THREE.MeshStandardMaterial( {color: 0xffffff} );
        material.metalness=0.9
        material.roughness=0.2
        const cube = new THREE.Mesh( geometry, material );
        cube.position.y=4;
        this.cube=cube;
        this.scene.add( cube );
    }
    addPlan(){

        const geometry = new THREE.PlaneGeometry(40, 40);
        const material = new THREE.MeshLambertMaterial({color: 0x222222});
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

        const clock = new THREE.Clock();

        const animate = () => {

            if(this.cube){
                this.cube.rotation.x=clock.getElapsedTime()
                this.cube.rotation.y=clock.getElapsedTime()
            }

            this.stats.update()

            requestAnimationFrame(animate);

            this.renderer.render(this.scene, this.camera);
        }

        animate();

    }
}