import * as CANNON from "cannon-es";
import CannonDebugger from 'cannon-es-debugger'
import {SketchBoxScene} from "../SketchBoxScene";
import {Updatable} from "../type";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import world from "@/assets/model/world1.glb?url"
// @ts-ignore
import {threeToCannon as threeToCannonCore } from "../core/three-to-cannon.js";

import { threeToCannon, ShapeType } from 'three-to-cannon';

import {threeToCannonQuaternion} from "../core/threeToCannon";
import {Mesh} from "three";
import {CannonMaterialManager} from "./CannonMaterialManager";
import {setupMeshProperties} from "../hooks/mesh/character";

export class WordPhysics implements Updatable {
    world: CANNON.World
    //主类的引用
    ins: SketchBoxScene
    //@ts-ignore
    debug: CannonDebugger
    //CannonMaterialManager
    cmm: CannonMaterialManager;
    //调试用的数据
    debugData={
        //是否需要调试
        needDebug:true
    }

    constructor(ins: SketchBoxScene) {
        this.ins = ins
        let world = new CANNON.World();
        world.gravity.set(0, -9.820, 0);
        world.broadphase = new CANNON.SAPBroadphase(world);
        world.allowSleep = true;
        this.cmm=new CannonMaterialManager(world)
        /**
         * GSSolver（Gauss-Seidel Solver）是一种用于解决刚体间接触约束的求解器。它主要用于处理物体之间的碰撞和接触问题。
         */
        const solver = new CANNON.GSSolver();
        solver.iterations = 1
        world.solver = solver

        this.world = world
        this.addGround()
        //添加物理的调试工具
        if(this.debugData.needDebug){
            this.initDebug()
        }

        // this.ins.dat.add(this.debugData, "needDebug").name("调试模式").onChange((e)=>{
        //     console.log("eee",this.debugData)
        // })
    }

    initDebug() {
        // @ts-ignore
        this.debug = new CannonDebugger(this.ins.scene, this.world)
    }

    addGround() {
        const floorSize = new CANNON.Vec3(20, 1, 20); // 指定平面的大小

        const floorShape = new CANNON.Box(new CANNON.Vec3(
            floorSize.x * 0.5,
            floorSize.y * 0.5,
            floorSize.z * 0.5
        ));

        const floorBody = new CANNON.Body({shape: floorShape});
        floorBody.position.set(0, 15, -15)
        floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI * 0.07);

        this.world.addBody(floorBody);
    }

    render(delta: number, elapsedTime: number) {
        try {
            if (this.debugData.needDebug) {
                // this.debug.update()
            }
            // console.log(delta,elapsedTime)
            // this.world.step(delta,elapsedTime)
            this.world.step(delta)
        } catch (e) {
            // @ts-ignore
            console.log("物理渲染报错", e.message)
        }
    }

    destroy() {
        this.debug = null
        // 释放所有刚体和约束的资源
        this.world.bodies.forEach(body => this.world.removeBody(body));
        this.world.constraints.forEach(constraint => this.world.removeConstraint(constraint));
        // 清除引用
        this.world.bodies.length = 0;
        this.world.constraints.length = 0;
        // @ts-ignore
        this.world = null;
    }

    load() {
        return new Promise(resolve => {
            // resolve(1)
            // return
            let loader = new GLTFLoader(this.ins.loadMana)
            loader.load(world, (res) => {

                console.log("g加载结果", res)

                let t;

                res.scene.traverse((child) => {
                    //@ts-ignore
                    if(child.isMesh){
                        child.receiveShadow=true
                        child.castShadow=true
                        // @ts-ignore
                        // this.ins.skyLight.csm.setupMaterial(child.material);

                        setupMeshProperties(child)
                    }

                    if (child.hasOwnProperty('userData')) {

                        if(child.userData.type==="wtaer"){
                            console.log("ssss",child)
                            t=child
                        }

                        if (child.userData.hasOwnProperty('data')) {
                            if (child.userData.data === 'physics') {
                                child.visible=false
                                if (child.userData.hasOwnProperty('type')) {

                                    if (child.userData.type === 'box') {

                                        const body = new CANNON.Body({mass: 0});
                                        body.material=this.cmm.getMaterial("ground")

                                        const result = threeToCannon(child, {type: ShapeType.BOX});
                                        // @ts-ignore
                                        body.addShape(result.shape);

                                        body.position.set(child.position.x, child.position.y, child.position.z)
                                        body.quaternion = threeToCannonQuaternion(child.quaternion)
                                        this.ins.physicsIns.world.addBody(body)


                                    } else if (child.userData.type === 'trimesh') {

                                        let res = threeToCannonCore(child, {type: threeToCannonCore.Type.MESH})
                                        const body = new CANNON.Body({mass: 0});
                                        body.material=this.cmm.getMaterial("ground")

                                        body.addShape(res)
                                        body.position.set(child.position.x, child.position.y, child.position.z)
                                        body.quaternion = threeToCannonQuaternion(child.quaternion)
                                        this.ins.physicsIns.world.addBody(body)
                                    }
                                }
                            }
                        }
                    }
                })

                this.ins.scene.add(res.scene)
                resolve(t)
            })
        });
    }
}