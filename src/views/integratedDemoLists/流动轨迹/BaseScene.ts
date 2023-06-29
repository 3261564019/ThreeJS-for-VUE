import * as THREE from "three";
import {Mesh} from "three";
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import {RotationBox} from "../高德地图/hooks/childScene/RotationBox";
import {ShiningWall} from "../高德地图/hooks/childScene/ShiningWall";
import {ChildScene} from "../高德地图/types";

export class CurvePath extends BaseInit {

    curve: THREE.CatmullRomCurve3
    splitLineArr: Mesh[] = []

    //子场景
    private childScene: ChildScene[]=[]
    constructor() {
        super({
            needLight: false,
            renderDomId: "#curve-path",
            needOrbitControls: true,
            needAxesHelper: true,
            adjustScreenSize:true
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.addPlan();

        this.addLight();

        this.addLine();


        this.addBall();
        /*
            解决一开始经纬度转换（latLongToPosition）返回值为0的问题
         */
        setTimeout(() =>{
            // this.childScene.push(new RotationBox(this.scene));

            this.childScene.push(new ShiningWall({scene:this.scene,wallPath:[
                    [-20,-20],
                    [20,-20],
                    [20,20],
                    [-20,20],
                    [-20,-20],
                ],color:"#FFD500",onlyThreeScene:true}))
        },10)

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

    addPlan() {

        const geometry = new THREE.PlaneGeometry(40, 40);
        const material = new THREE.MeshLambertMaterial({color: 0x222222});
        material.side = THREE.DoubleSide
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

    addLight() {

        //创建聚光灯
        const light = new THREE.SpotLight("#fff");
        light.castShadow = true;            // default false
        light.position.x = 20;
        light.position.y = 30;

        this.scene.add(light);
    }

    addLine() {
        this.curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-20, 10, -20),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(20, 10, 20)
        ])


        //创建虚线的小结
        for (let i = 0; i < 30; i++) {

            const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.4);
            const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
            let splitLine = new THREE.Mesh(geometry, material);

            // splitLine.position.set(i*2,0,0)
            let t = splitLine.clone()

            this.splitLineArr.push(t)

            this.scene.add(t)


        }


    }

    init() {

        this.renderer.shadowMap.enabled = true;

        this.camera.position.set(0, 30, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

        const clock = new THREE.Clock();

        let round = 10;

        const animate = () => {

            let t = clock.getElapsedTime();
            // let percent = (t % round) / round
            // console.log("当前百分比",percent)


            this.stats.update()

            this.childScene.forEach(scene=>{
                scene.render(clock.getDelta(),clock.elapsedTime);
            })

            if (this.curve) {


                this.splitLineArr.forEach((v, index) => {
                    let at = (index / 30) + (t % 30) / 30
                    if (at > 1) {
                        at %= 1
                    }
                    let position = this.curve.getPointAt(at) as THREE.Vector3;

                    let tangent=this.curve.getTangentAt(at);
                    // console.log(tangent);
                    let lookAtVec=tangent.add(position);
                    v.lookAt(lookAtVec)
                    // @ts-ignore
                    v.position.set(...position)
                })
            }

            this.raf=requestAnimationFrame(animate);

            this.renderer.render(this.scene, this.camera);
        }

        animate();

    }
}
