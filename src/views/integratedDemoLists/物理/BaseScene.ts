import * as THREE from "three";
import gsap from 'gsap';
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import CANNON from "cannon-es";
import {MeshRigid, usePhysics} from "./usePhysics";
import CannonDebugger from 'cannon-es-debugger';
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";


export class physicsBaseScene extends BaseInit {

    private readonly world:CANNON.World;
    private mrMap:Array<MeshRigid>;
    private cannonDebugger=null


    constructor() {
        super({
            needLight:false,
            renderDomId:"#physicsBaseScene",
            needOrbitControls:false,
            needAxesHelper:true
        } as  BaseInitParams);


        this.initDebug();

        this.init();

        this.addPlan();

        this.addLight();

        let {world,mrMap,init}=usePhysics(this);
        this.world=world;
        this.mrMap=mrMap;
        init();



        // @ts-ignore
        this.cannonDebugger = new CannonDebugger(this.scene,this.world )
    }
    addPlan(){

        const geometry = new THREE.PlaneGeometry(500, 500);
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
    init() {

        this.renderer.shadowMap.enabled = true;

        this.camera.position.set(0, 30, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

        const clock = new THREE.Clock();

        const animate = () => {



            // console.log()
            this.stats.update()

            this.raf=requestAnimationFrame(animate);

            if(this.world){
                this.world.step(1 / 60,clock.getDelta(),3);
                this.mrMap.map(
                    ({mesh,body}, index, array)=>{

                        // @ts-ignore
                        mesh.position.copy(body.position)
                        // @ts-ignore
                        mesh.quaternion.copy(body.quaternion)

                        if(mesh.userData.isBall){
                            this.camera.position.x=body.position.x
                            this.camera.position.y=body.position.y+30
                            this.camera.position.z=body.position.z+40

                            // console.log("位置",body.position)
                            // @ts-ignore
                            this.camera.lookAt(body.position.x,body.position.y,body.position.z)
                        }
                    }
                )
            }

            if(this.cannonDebugger){
                this.cannonDebugger.update()
            }


            this.renderer.render(this.scene, this.camera);
        }

        animate();

    }
}