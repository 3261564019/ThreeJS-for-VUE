import * as THREE from "three";
import {Mesh} from "three";
import {BaseInit, BaseInitParams} from "../../three/classDefine/baseInit";

export class CurvePath extends BaseInit {

    curve: THREE.CatmullRomCurve3
    splitLineArr: Mesh[] = []

    constructor() {
        super({
            needLight: false,
            renderDomId: "#curve-path",
            needOrbitControls: true,
            needAxesHelper: true
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.addPlan();

        this.addLight();

        this.addLine();

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
            new THREE.Vector3(-20, 10, 5),
            new THREE.Vector3(-5, 5, 5),
            new THREE.Vector3(0, 10, 0),
            new THREE.Vector3(5, 5, 5),
            new THREE.Vector3(20, 10, 5)
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
            let percent = (t % round) / round


            // console.log("当前百分比",percent)


            this.stats.update()


            if (this.curve) {


                this.splitLineArr.forEach((v, index) => {
                    let at = (index / 30) + (t % 30) / 10
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

            requestAnimationFrame(animate);

            this.renderer.render(this.scene, this.camera);
        }

        animate();

    }
}