
import * as THREE from "three";
import gsap from 'gsap';
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import {DragControls} from "three/examples/jsm/controls/DragControls";
import {Mesh} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export class BaseScene extends BaseInit {

    // @ts-ignore
    ball:Mesh
    transformControl:TransformControls
    constructor() {
        super({
            needLight:true,
            renderDomId:"#renderDom",
            needOrbitControls:true,
            needAxesHelper:false,
            adjustScreenSize:true
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.addPlan();



        this.addBall();


        //调整已有的OrbitControls
        (this.control as OrbitControls).update();
        this.control.addEventListener( 'change',()=>{this.manualRender()} );

        //创建transformControl
        this.transformControl = new TransformControls( this.camera,this.renderer.domElement );
        //设置该控制器的大小
        this.transformControl.setSize(0.7);
        this.transformControl.addEventListener( 'change',()=>{this.manualRender()} );
        this.scene.add(this.transformControl)

        //创建拖拽控制器
        this.initDragControls();
    }
    initDragControls(){
        //拖拽控件对象
        let dragControls = new DragControls(this.scene.children,this.camera,this.renderer.domElement );
        //拖拽控件对象设置鼠标事件
        dragControls.addEventListener( 'hoveron',  ( event ) => {
            console.log(event,event.object.type)
            if(event.object.type==="Mesh"){
                //控件对象transformControl与选中的对象object绑定
                this.transformControl.attach( event.object );
            }
        });

        //当他被拖拽的时候，禁用已经存在的控制器
        this.transformControl.addEventListener( 'dragging-changed',  ( event )=>{
            this.control.enabled = ! event.value;
        });

        this.transformControl.addEventListener( 'change',()=>{this.manualRender()} );

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

        this.ball=sphere
        this.scene.add(this.ball);
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

            this.renderer.render(this.scene, this.camera);
        }

        animate();

    }
}