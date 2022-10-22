import * as THREE from "three";
import gsap from 'gsap';
import {BaseInit, BaseInitParams} from "../../three/classDefine/baseInit";
import {Raycaster} from "three";


import img1 from "/src/assets/img/cubeImg/1.png";
import img2 from "/src/assets/img/cubeImg/2.png";
import img3 from "/src/assets/img/cubeImg/3.png";
import img4 from "/src/assets/img/cubeImg/4.png";
import img5 from "/src/assets/img/cubeImg/5.png";
import img6 from "/src/assets/img/cubeImg/6.png";

export class CubeScene extends BaseInit {
    cube:THREE.Mesh
    public rayCaster:Raycaster
    //标签位置变化的回调
    public itemPositionChange:Function
    //标签被遮挡时显示与隐藏的回调
    public visibleChange:Function
    //用于调试的曲线
    public debugLine:any
    public infoList:Array<any>
    //是否总是显示label
    public alwaysShow:boolean

    constructor({
                    infoList,
                    alwaysShow
                }) {
        super({
            needLight: false,
            needOrbitControls: true,
            renderDomId:"#cubeDemo",
            calcCursorPosition:true,
            needScreenSize:true,
            needAxesHelper:true,
            needTextureLoader:true
        } as BaseInitParams);

        this.infoList=infoList;
        this.alwaysShow=alwaysShow;

        this.initDebug();

        this.init();

        // this.addPlan();

        this.addLight();

        // this.addBall();
        this.addCube();
    }
    addCube(){
        let materials=[];
        let images=[img1,img2,img3,img4,img5,img6]
        for(let i=0;i<6;i++){

            let texture = this.textureLoader.load(images[i]);
            materials.push(new THREE.MeshBasicMaterial( { map:texture }));

        }

        const geometry = new THREE.BoxGeometry( 8, 8, 8 );
        const material = new THREE.MeshStandardMaterial( {color: 0xffffff} );
        material.metalness=0.9
        material.roughness=0.2
        const cube = new THREE.Mesh( geometry, materials );
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
        this.rayCaster = new Raycaster();
        this.camera.position.set(0, 0, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position);

        let line = new THREE.ArcCurve(
            new THREE.LineCurve3(0, 0, 0),
            new THREE.LineCurve3(6, 6, 0)
        )
        const material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 1,
            linecap: 'round', //ignored by WebGLRenderer
            linejoin: 'round' //ignored by WebGLRenderer
        });

        // this.debugLine=new THREE.Mesh(line,material);

        // this.scene.add(line);

        // const helper = new THREE.CameraHelper( this.camera );
        // this.scene.add( helper );
        const clock = new THREE.Clock();

        const animate = () => {

            if (this.cube) {
                // this.cube.rotation.x=clock.getElapsedTime()
                // this.cube.rotation.y=clock.getElapsedTime()
            }

            // console.log(this.camera.position)

            this.infoList.map((v, index) => {
                //当前标签在三维坐标系中的位置 -1 至 1
                let temp = v.position.clone() as THREE.Vector3;
                temp.project(this.camera);
                //更新标签位置
                if (this.screenSize && this.itemPositionChange) {
                    let x = temp.x * this.screenSize.x;
                    let y = -temp.y * this.screenSize.y;
                    this.itemPositionChange(index, {x, y});
                }
                //检查是否可见
                if (!this.alwaysShow && this.rayCaster && this.visibleChange) {
                    // console.log(temp);
                    this.rayCaster.setFromCamera(temp, this.camera);
                    let res = this.rayCaster.intersectObjects(this.scene.children, true);
                    // console.log(res);
                    //距离相机最近的对象 与相机的距离
                    let nearDis = res[0]?.distance;
                    //当前点位距离目标的距离
                    let target = v.position.distanceTo(this.camera.position);

                    // console.log(target);

                    // this.visibleChange(index,nearDis < target);

                    //中间无障碍物就显示
                    if(res.length===0 || target < nearDis){
                        this.visibleChange(index,true);
                    }else{
                        this.visibleChange(index,false);
                    }
                }
            })


            this.stats.update()

            requestAnimationFrame(animate);

            this.renderer.render(this.scene, this.camera);
        }

        animate();

    }
}