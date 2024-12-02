import * as THREE from "three";
import gsap from 'gsap';
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import {
    BasicShadowMap, BufferGeometry,
    CatmullRomCurve3,
    Clock, Line, LineBasicMaterial,
    Mesh,
    MeshLambertMaterial,
    PCFSoftShadowMap, Raycaster,
    SpotLightHelper, Vector2,
    Vector3
} from "three";
import {DragControls} from "three/examples/jsm/controls/DragControls";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";

export class CurveScene extends BaseInit {

    curve:CatmullRomCurve3
    brick:Mesh
    private clock: Clock;
    boxs:Mesh[]=[]
    transformControl:TransformControls
    private curveObject: Line<BufferGeometry, LineBasicMaterial>;
    private rayLine: Line<BufferGeometry, LineBasicMaterial>;
    raycaster :Raycaster

    constructor() {
        super({
            needLight:false,
            renderDomId:"#curveRoot",
            needOrbitControls:true,
            needAxesHelper:false,
            adjustScreenSize:true,
            transparentRenderBg:true
        } as BaseInitParams);
        this.boxs=[]

        this.raycaster=new THREE.Raycaster();
        this.initDebug();

        this.init();

        this.addPlan();

        this.addLight();

        this.addCurve();
        this.addMoveBrick()
        this.addBox();
        this.animate()
        this.addRayDebug()
        //创建拖拽控制器
        this.initDragControls();
    }
    addRayDebug(){
        const rayMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        // 创建射线可视化的几何体
        const rayGeometry = new THREE.BufferGeometry();
        // 创建射线可视化的对象
        const rayLine = new THREE.Line(rayGeometry, rayMaterial);

        rayLine.userData.isTransformControl=true

        this.rayLine=rayLine
        this.scene.add(rayLine);
    }
    pointermove(event){

        let pointer=new Vector2()

        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        this.raycaster.setFromCamera( pointer,this.camera );

        const intersects = this.raycaster.intersectObjects( this.boxs, false );

        if ( intersects.length > 0 ) {

            const object = intersects[ 0 ].object;

            this.transformControl.attach( object );
        }
    }
    initDragControls(){

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
        this.scene.add(this.transformControl)


        document.addEventListener( 'pointermove', this.pointermove.bind(this) );

        this.transformControl.addEventListener( 'dragging-changed',  ( event )=>{
            this.control.enabled = ! event.value;
        });

        this.transformControl.addEventListener( 'objectChange',  ()=>{
           this.regenerate()
        });


    }
    regenerate(){
        let o=this.transformControl.object
        console.log("ooo",o)
        console.log("this.curve.points",this.curve.points)
        if(o?.userData.hasOwnProperty("index")){

            let index=o?.userData.index

            if(index==4){
                index=0
            }

            this.curve.points[index].copy(o?.position)
            const points = this.curve.getPoints( 100 );
            //通过点队列设置该 BufferGeometry 的 attribute。
            const geometry = new THREE.BufferGeometry().setFromPoints( points );
            this.curveObject.geometry.dispose(); // 释放旧的几何体以避免内存泄漏
            this.curveObject.geometry = geometry; // 应用新的几何体
        }
        // console.log(this.transformControl.object)
    }
    addBox(){
        // let m=new MeshLambertMaterial({color:"#299a48"});
        let m=new MeshLambertMaterial({color:"#299a48"});
        const geometry = new THREE.BoxGeometry( 2, 2, 2 );
        for (let i =1;i<5;i++){
            let mesh=new Mesh(geometry,m);
            mesh.castShadow=true;
            mesh.position.copy(this.curve.getPointAt(i*25/100));
            mesh.userData.index=i
            this.scene.add(mesh)
            this.boxs.push(mesh)
        }
        console.log("this.boxs",this.boxs)

    }
    addCurve(){
        //用Catmull-Rom算法， 从一系列的点创建一条平滑的三维样条曲线
        const curve = new CatmullRomCurve3( [
            new THREE.Vector3(   20,  0,  - 20 ),
            new THREE.Vector3(  20,  20, 20 ),
            new THREE.Vector3(  - 20,  0, 20 ),
            new THREE.Vector3(  -20, 0, - 20,)
        ] );
        //让曲线自动闭合
        curve.closed=true;
        this.curve=curve;
        //取该曲线平均距离的100个点的位置
        const points = curve.getPoints( 100 );
        //通过点队列设置该 BufferGeometry 的 attribute。
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        //线条材质
        const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
        //创建图形并加入场景
        const curveObject = new THREE.Line( geometry, material );
        curveObject.castShadow = true;
        
        this.curveObject=curveObject
        this.scene.add(curveObject);
    }
    addPlan(){

        const geometry = new THREE.PlaneGeometry(80, 110);
        const material = new THREE.MeshLambertMaterial({color:"#eeeeee"});
        material.side=THREE.DoubleSide
        const plane = new THREE.Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = -10;
        plane.position.z = 0;

        //添加地板容器
        this.scene.add(plane);

    }
    addLight(){

        //创建聚光灯
        const light = new THREE.SpotLight("#fff",30000,100,30);
        light.castShadow = true;            // default false
        light.position.x = 10;
        light.position.y = 50;
        // light.distance=180
        light.shadow.mapSize.width = 4096;
        light.shadow.mapSize.height = 4096;
        // light.shadow.bias = -0.001; // 减小阴影偏移量
        this.scene.add(new SpotLightHelper(light))
        this.scene.add(light);


    }
    addMoveBrick(){


        let m=new MeshLambertMaterial({color:"#1e7cef"});
        const geometry = new THREE.BoxGeometry( 4, 2, 1 );

        let brick=new Mesh(geometry,m);
        brick.castShadow = true;
        this.brick=brick;
        this.scene.add(brick);
    }
    init() {
        this.control.damping = 1;
        // this.renderer.shadowMap.enabled = true;
        // this.renderer.shadowMap.type=PCFSoftShadowMap
        // this.renderer.shadowMap.width = 4096;
        // this.renderer.shadowMap.height = 4096;
        this.clock = new THREE.Clock();
        this.camera.position.set(0, 30, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

    }
    animate = () => {
        let time = Date.now();
        const loopTime = 10 * 1000; // loopTime: 循环一圈的时间
        let t = (time % loopTime) / loopTime;
        this.stats.update();
        // console.log("百分比",t);
        // mesh.lookAt(lookAtVec);
        if(this.curve && this.brick){
            //根据百分比获取其对应在曲线上的坐标
            const position = this.curve.getPointAt(t);
            //将该坐标应用于砖块使其移动
            this.brick.position.copy(position);

            // this.brick.lookAt(new Vector3(0,0,0));
            //改变物体朝向
            let tangent=this.curve.getTangentAt(t);
            // console.log(tangent);
            let lookAtVec=tangent.add(position);
            this.brick.lookAt(lookAtVec);
        }
        this.control.update()
        this.raf=requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}