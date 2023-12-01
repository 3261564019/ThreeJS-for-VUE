import * as THREE from "three";
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import pic from "@/assets/img/panoramic/DJI_0684.jpg?url"
import {Power2,Power1} from "gsap";
import {Mesh, MeshBasicMaterial, SphereGeometry} from "three";
import gsap from 'gsap';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
export class BaseScene extends BaseInit {
    private ball: Mesh<SphereGeometry, MeshBasicMaterial>;
    constructor() {
        super({
            needLight:false,
            renderDomId:"#renderDom",
            needOrbitControls:true,
            needAxesHelper:true
        } as BaseInitParams);

        this.initDebug();

        this.init();

        // this.addPlan();

        this.addLight();

        this.addBall();

        this.animate()
        
        this.enter()
    }
    enterScene() {
        // 获取相机坐标
        let cameraLook = new THREE.Vector3();
        this.camera.getWorldDirection(cameraLook);

        /**
         * 相机初始化好以后的位置是 z:0 y:1200 视角在顶部
         * 需要将其移动到 y:0  z :1200的位置 并且始终看向原点
         */
        let t={
            fov:this.camera.fov,
            cz: 0,
            cy:this.camera.position.y,
            r:0
        }

        // this.camera.fov = 50;

        this.dat.add(this.camera,"fov",-180,180,0.01).name("fov").onChange(e=>{
            this.camera.updateProjectionMatrix();
        })

        // this.camera.lookAt(0,0,1000)

        console.log("相机位置",this.camera.position)

        // this.camera.position.set(0,0,0)

        gsap.to(t, {
            cy: 0,
            cz:1200,
            duration: 2.5,
            r:Math.PI,
            ease:Power1.easeOut,
            onUpdate: ()=>{
                // 更新相机位置和视角大小
                this.camera.position.y = t.cy;
                this.camera.position.z = t.cz;
                // this.camera.fov = t.fov;
                // this.camera.updateProjectionMatrix();
                // 旋转效果
                this.ball.rotation.y += 0.01;
                // 更新看向位置
                const target = new THREE.Vector3(0, 0, 0);
                this.camera.lookAt(target);
            },
            onComplete: function() {
                gsap.killTweensOf(this);
            }
        });
    }
    enter(){
        let p={
            fov: 170,
            ars: 40,
            rot: 0,
        }
        let that=this
        let tween = gsap.to(p, {
            fov: 30,
            ars: 0,
            rot: Math.PI,
            duration: 2.3,
            ease: Power2.easeOut,
            onUpdate:()=>{
                // 视角由大到小
                this.camera.fov = p.fov;
                this.camera.updateProjectionMatrix();
                // 旋转
                this.ball.rotation.y = p.rot;
            },
            onComplete:()=>{
                tween.kill()
                // 旋转入场动画
                that.enterScene()
            }
        });
    }
    addPlan(){

        const geometry = new THREE.PlaneGeometry(40, 40);
        const material = new THREE.MeshLambertMaterial({color:"#ae8643"});
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

        // 初始化球体
        var geometry = new THREE.SphereGeometry(1200  , 1200  , 1200  );
        geometry.scale(-1, 1, 1);
        // 创建材质并设置全景图
        var material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(pic)
        });
        // 全景图贴在球体上
        this.ball = new THREE.Mesh(geometry, material);
        this.ball.rotation.y=-Math.PI/2
        // this.ball.rotation.x=-Math.PI/2

        this.dat.add(this.ball.rotation,"x",-6,6,0.01).name("x")
        this.dat.add(this.ball.rotation,"y",-6,6,0.01).name("y")
        this.dat.add(this.ball.rotation,"z",-6,6,0.01).name("z")

        // mesh.scale.set(4,4,4)
        this.ball.position.set(0,2,0)
        // 添加到场景
        this.scene.add(this.ball);
    }
    init() {

        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.9;
        this.renderer.outputEncoding = THREE.LinearEncoding;
        this.renderer.shadowMap.enabled = true;

        this.camera=new THREE.PerspectiveCamera(170, window.innerWidth / window.innerHeight, 0.1, 10000);
        // //定位相机指向场景中心
        this.camera.position.set(0,  1200, 0);
        this.camera.lookAt(0,0,0)
        this.control = new OrbitControls(this.camera, this.renderer.domElement);
        this.control.rotateSpeed = -0.4;
        this.control.minDistance=260
        this.control.maxDistance=2600
        this.control.dampingFactor=0.07

        this.dat.add(this.control,"minDistance",-500,500,0.01).name("minDistance")
        this.dat.add(this.control,"maxDistance",-500,3000,0.01).name("maxDistance")

        this.control.enableDamping=true
    }
    animate(){
        this.stats.update()

        this.raf=requestAnimationFrame(this.animate.bind(this));
        this.control.update()
        this.renderer.render(this.scene, this.camera);
    }
}