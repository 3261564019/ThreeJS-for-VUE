import {SketchBoxScene} from "../SketchBoxScene";
import boxMax from "@/assets/model/box_man.glb?url"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import boxMan from "@/assets/model/box_man.glb?url";
import {MeshRigid} from "../../物理/types";
import {AnimationAction, AnimationMixer} from "three";
import {Updatable} from "../type";
import * as CANNON from "cannon-es";

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
        })
    }

    render(delta: number, elapsedTime: number): void {
        this.animationMixer.update(delta);
    }
}