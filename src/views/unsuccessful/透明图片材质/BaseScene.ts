
import * as THREE from "three";
import gsap from 'gsap';
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import {Texture} from "three";
import img from "@/assets/img/cubeImg/5.png"
import shanxi from "./shanxi.json";
import sxPic from "@/assets/img/demo/sx.png";

export class TransparentMaterial extends BaseInit {
    constructor() {
        super({
            needLight:false,
            renderDomId:"#baseRoot",
            needOrbitControls:true,
            needAxesHelper:true,

        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.addShanXi();
        // this.addPlan();
        console.log(shanxi.geometry.coordinates)

        this.addLight();

        this.initDebug();

        this.addBall();
        this.camera.position.set(0,0,2);
        this.camera.lookAt(0,0,0)
    }
    addShanXi(){
        const shape = new THREE.Shape();

        //x 和 y 的偏移量
        let xSkew = 35;
        let ySkew = 109;

        let out=shanxi.geometry.coordinates;

        out[0][0].forEach((item,index)=>{
            if(index===0){
                // @ts-ignore
                shape.moveTo(item[1]- xSkew,item[0] - ySkew,0)
            }else{
                // @ts-ignore
                shape.lineTo(item[1]- xSkew,item[0] - ySkew,0)
            }
        })

        // 图形设置  没有洞的墙
        const extrudeSettings = {
            //图形深度
            depth: 1,
            //此属性为false可以去掉默认立方体的圆角
            bevelEnabled: false
        };



        //创建形状
        const zoneGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);


        const texture = new THREE.TextureLoader().load(sxPic);
        texture.flipY=true;
        // texture.mapping=THREE.
        //通用墙体材质
        let defaultMaterial = new THREE.MeshPhongMaterial({
            // color: "#f00",
            //高光颜色
            specular:0x333333,
            //高光部分的亮度
            shininess:20,
            map:texture
            // opacity:0.8,
            //
            // transparent: true,
        });

        const s = new THREE.Mesh(zoneGeometry, defaultMaterial);

        s.rotation.z=1.27;
        s.rotation.y=Math.PI;

        this.dat.add(s.rotation,"x",0,10,0.01).name("x轴旋转")
        this.dat.add(s.rotation,"y",0,10,0.01).name("y轴旋转")
        this.dat.add(s.rotation,"z",0,10,0.01).name("z轴旋转")

        this.scene.add(s);
    }
    addPlan(){

        const geometry = new THREE.PlaneGeometry(40, 40);
        const texture = new THREE.TextureLoader().load( img);
        const material = new THREE.MeshLambertMaterial({color: 0x222222,map:texture,transparent:true});
        material.opacity=0.5;
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
        light.position.y = 20;
        light.position.z = 20;

        this.scene.add(light);
    }
    addBall(){

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(3, 33, 33),
            new THREE.MeshLambertMaterial({color: "#fff"})
        );

        sphere.position.x = 10;
        sphere.position.y = -2;
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