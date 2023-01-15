import * as THREE from "three";
import gsap from 'gsap';
import {BaseInit, BaseInitParams} from "../../three/classDefine/baseInit";
import {CatmullRomCurve3, Mesh, MeshLambertMaterial, Vector3} from "three";

export class CurveScene extends BaseInit {

    curve:CatmullRomCurve3
    brick:Mesh

    constructor() {
        super({
            needLight:false,
            renderDomId:"#curveRoot",
            needOrbitControls:true,
            needAxesHelper:true
        } as BaseInitParams);

        this.initDebug();

        this.init();

        // this.addPlan();

        this.addLight();

        this.addBall();

        this.addCurve();

        this.addBox();
    }
    addBox(){
        let m=new MeshLambertMaterial({color:"#299a48"});
        const geometry = new THREE.BoxGeometry( 4, 2, 1 );
        for (let i =1;i<5;i++){
            let mesh=new Mesh(geometry,m);
            mesh.position.copy(this.curve.getPointAt(i*25/100));
            this.scene.add(mesh)
        }

    }
    getPosition(t) {
        const position = this.curve.getPointAt(t); // t: 当前点在线条上的位置百分比，后面计算
        mesh.position.copy(position);
    }
    addCurve(){
        //用Catmull-Rom算法， 从一系列的点创建一条平滑的三维样条曲线
        const curve = new CatmullRomCurve3( [
            new THREE.Vector3(   20,  0,  - 20 ),
            new THREE.Vector3(  20,  20, 20 ),
            new THREE.Vector3(  - 20,  0, 20 ),
            new THREE.Vector3(  - 20, 0, - 20,)
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
        this.scene.add(curveObject);
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


        let m=new MeshLambertMaterial({color:"#1e7cef"});
        const geometry = new THREE.BoxGeometry( 4, 2, 1 );

        let brick=new Mesh(geometry,m);

        this.brick=brick;
        this.scene.add(brick);
    }
    init() {

        this.renderer.shadowMap.enabled = true;

        this.camera.position.set(0, 30, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

        const clock = new THREE.Clock();

        const loopTime = 10 * 1000; // loopTime: 循环一圈的时间

        const animate = () => {
            let time = Date.now();
            let t = (time % loopTime) / loopTime;
            this.stats.update();
            // console.log("百分比",t);
            // const tangent = this.curve.getTangentAt(clock.getDelta());
            //
            // const lookAtVec = tangent.add(position); // 位置向量和切线向量相加即为所需朝向的点向量
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

                this.camera.lookAt(lookAtVec);
                // this.camera.position.copy(position);

            }

            requestAnimationFrame(animate);

            this.renderer.render(this.scene, this.camera);
        }

        animate();

    }
}