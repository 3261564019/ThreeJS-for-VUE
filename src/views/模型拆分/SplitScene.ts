
import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {Group} from "three";
import {BaseInit, BaseInitParams} from "../../three/classDefine/baseInit";
import gsap from 'gsap';

export class SplitScene extends BaseInit {

    school:Group

    debugParam={
        assembly:true
    }

    constructor() {
        super({
            needLight:false,
            renderDomId:"#sceneDemo",
            needOrbitControls:true,
            needAxesHelper:true
        } as BaseInitParams);

        this.initDebug();

        this.init();

        // this.addPlan();

        this.addLight();

        // this.addBall();
        this.loadSchool();
    }
    moveModel(to,model){
        let params={duration:2,delay:0,...to};
        console.log("移动参数",params)
        gsap.to(model.position,params);
    }
    loadSchool() {
        new GLTFLoader().load("http://qrtest.qirenit.com:81/share/img/pubg_school/scene.gltf",
            (res) => {

                console.log("学校模型", res.scene);

                // res.scene.position.y = this.debugParam.schoolPositionY;
                // this.schoolScene = res.scene

                //添加文字标签
                // const label = new CSS2DObject(document.getElementById("schoolInfo"));
                // label.position.set(0, 10, 0);

                // this.schoolScene.add(label);

                // this.dat.add(this.schoolScene.position, "y", -5, 5, 0.1).name("学校Y轴");

                //加载完后在该对象上记录原始位置和新位置
                let r = 30;
                let count=0;
                res.scene.traverse( (child)=>{
                    child.fromPosition = {x:child.position.x,y:child.position.y,z:child.position.z}
                    child.toPosition ={x:Math.random()* r,y:Math.random()* r,z:Math.random()* r}
                    count++;
                })

                console.log("处理次数",count);
                this.school=res.scene;
                this.scene.add(this.school);
                //初始化调试学校的程序
                console.log("处理完后",this.school);
                this.loadDat();
            });
    }
    loadDat(){
        this.dat.add(this.debugParam,'assembly').name("是否合并").onChange(
            e=>{
                // this.school.position.set(10,0,0);


                if(e){
                    this.school.traverse(e => {
                        if (e.isMesh) {
                            this.moveModel(e.fromPosition,e);
                        }
                    });
                }else{
                    this.school.traverse(e => {
                        if (e.isMesh) {
                            this.moveModel(e.toPosition,e);
                        }
                    });
                }
            }
        );
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
        const light = new THREE.AmbientLight("#fff");


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

            this.stats.update()

            requestAnimationFrame(animate);

            this.renderer.render(this.scene, this.camera);
        }

        animate();

    }
}