
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
    // @ts-ignore
    plane:Mesh

    // @ts-ignore
    debugParams={
        ballLayer:0,
        planLayer:0,
        crameLayer:0,
    }

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
        //最小拖动步幅
        // this.transformControl.translationSnap=1;
        //设置该控制器的大小
        this.transformControl.setSize(0.6);
        this.transformControl.addEventListener( 'change',()=>{this.manualRender()} );
        //遍历整个控制器元素并添加标识
        this.transformControl.traverse(item=>{
            item.userData.isTransformControl=true
        })

        console.log(this.transformControl);
        this.scene.add(this.transformControl)

        //创建拖拽控制器
        this.initDragControls();


        console.log("默认值",this.ball.layers.mask)

        this.dat.add(this.debugParams,"ballLayer",0,32,1).name("球体图层").onChange(
            (p:number)=>{
                console.log("参数：",p)
                this.ball.layers.set(p);
                console.log("球体图层变化为",this.ball.layers.mask)
            }
        )
    }
    initDragControls(){
        //拖拽控件对象
        let dragControls = new DragControls(this.scene.children,this.camera,this.renderer.domElement );
        //拖拽控件对象设置鼠标事件
        dragControls.addEventListener( 'hoveron',  ( event ) => {
            //当他是Mesh对象，并且不是控制器元素时才对其进行拖拽绑定
            if(event.object.type==="Mesh" && !event.object.userData.isTransformControl){
                //控件对象transformControl与选中的对象object绑定
                this.transformControl.attach( event.object );
            }
        });

        //当他被拖拽的时候，禁用已经存在的控制器
        this.transformControl.addEventListener( 'dragging-changed',  ( event )=>{
            this.control.enabled = ! event.value;
            console.log("在拖拽",event)

        });

        this.transformControl.addEventListener( 'change',(e)=>{
            console.log("change---",e)
            // this.manualRender()
            }
        );

    }
    addPlan(){

        const geometry = new THREE.PlaneGeometry(40, 40);
        const material = new THREE.MeshPhongMaterial({color:new THREE.Color("#249444")});
        material.side=THREE.DoubleSide
        const plane = new THREE.Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        this.plane=plane
        //添加地板容器
        this.scene.add(this.plane);

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

        sphere.position.x = 0;
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
    destroy() {
        super.destroy();
        this.transformControl.dispose();
    }
}