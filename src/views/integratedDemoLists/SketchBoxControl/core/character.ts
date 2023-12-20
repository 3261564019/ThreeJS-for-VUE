import {SketchBoxScene} from "../SketchBoxScene";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import boxMan from "@/assets/model/box_man.glb?url";
import girl from "@/assets/model/111.gltf?url";
import gt from "@/assets/model/world.glb?url";
import {MeshRigid} from "../../物理/types";
import {AnimationAction, AnimationMixer} from "three";
import {Updatable} from "../type";
import * as CANNON from "cannon-es";
import { Physics, usePlane, useConvexPolyhedron } from 'use-cannon'
// @ts-ignore
import {threeToCannon} from "./three-to-cannon.js"

export class Character implements Updatable {

    ins: SketchBoxScene
    private current: MeshRigid;
    private animationMixer: AnimationMixer;
    animationMap: Map<string, AnimationAction>;


    constructor(ins: SketchBoxScene) {
        this.animationMap = new Map()
        this.ins = ins
    }

    load() {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader(this.ins.loadMana);
            loader.load(
                boxMan,
                (res) => {
                    console.log("加载结果", res)
                    let t = res.scene.children[0]
                    t.scale.set(2, 2, 2)

                    t.traverse(child => {
                        // @ts-ignore
                        if (child.isMesh) {
                            child.castShadow = child.receiveShadow = true
                            // https://discourse.threejs.org/t/cant-export-material-from-blender-gltf/12258
                            // @ts-ignore
                            child.material.roughness = 1
                            // @ts-ignore
                            child.material.metalness = 0
                        }
                    })

                    // @ts-ignore
                    this.animationMixer = new AnimationMixer(res.scene);

                    let temp = {}
                    //将动画存到map中，动画名作为key方便调用
                    res.animations.forEach(v => {
                        // @ts-ignore
                        temp[v.name] = v.name
                        this.animationMap.set(v.name, this.animationMixer.clipAction(v))
                    })

                    // console.log("this.animationMap.get(\"idle\")",this.animationMap.get("idle"))

                    const radius = 1.2; // 球体半径

                    const sphereShape = new CANNON.Sphere(radius);

                    const body = new CANNON.Body({
                        mass: 1, // 质量
                        position: new CANNON.Vec3(0, 5, 0), // 位置
                        shape: sphereShape, // 形状
                    });
                    body.type=1

                    // 设置旋转因子为零，阻止刚体旋转
                    body.angularFactor.set(0, 0, 0);

                    // 设置线性因子为零，阻止刚体移动
                    // body.linearFactor.set(0, 0, 0);

                    this.ins.physicsIns.world.addBody(body)

                    this.ins.scene.add(t)
                    // @ts-ignore
                    this.animationMap.get("idle").play()

                    resolve(1)
                }
            )


            loader.load(
                gt,
                (res) => {
                    console.log("g加载结果", res)
                    const body = new CANNON.Body({ mass: 1 });
                    // @ts-ignore
                    // const {shape,offset,orientation} = threeToCannon(res.scene, {type: ShapeType.MESH});
                    // body.addShape(shape,offset,orientation);
                    // body.position.set(0,20,1)
                    // this.ins.physicsIns.world.addBody(body);
                    // res.scene.position.set(-3,5,0)
                    // this.ins.scene.add(res.scene)



                    res.scene.traverse((child) => {
                        if (child.hasOwnProperty('userData')) {
                            if (child.userData.hasOwnProperty('data')) {
                                if (child.userData.data === 'physics') {
                                    if (child.userData.hasOwnProperty('type')) {
                                       if (child.userData.type === 'trimesh') {
                                            console.log("trimesh", child)

                                           if(child.name==="Cube096"){
                                               child.position.set(0,10,0)
                                               this.ins.scene.add(child)

                                                let res=threeToCannon(child,{type: threeToCannon.Type.MESH})
                                                console.log("转换结果",res)

                                                let body=new CANNON.Body({mass:2})
                                                body.addShape(res)

                                                body.position.set(0,20,0)

                                                this.ins.physicsIns.world.addBody(body)
                                                throw "YEHOOOO!"
                                            // let phys = new TrimeshCollider(child, {});
                                            // this.physicsWorld.addBody(phys.body);
                                           }
                                       }
                                    }
                                }
                            }
                        }
                    })
                }
            )
        })
    }

    render(delta: number, elapsedTime: number): void {
        this.animationMixer.update(delta);
    }
}