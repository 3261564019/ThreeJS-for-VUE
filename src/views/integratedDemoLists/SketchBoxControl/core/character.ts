import {SketchBoxScene} from "../SketchBoxScene";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import boxMan from "@/assets/model/box_man.glb?url";
import {AnimationAction, AnimationMixer, Color, MathUtils, Object3D, Quaternion, Vector3} from "three";
import {Updatable} from "../type";
import * as CANNON from "cannon-es";
// @ts-ignore
import {threeToCannon} from "./three-to-cannon.js"
import {ThirdPersonControls} from "./thirdPersonControls";
import {PointerDrag, PointerLock} from "enable3d";
import * as THREE from "three";
import {Vec3} from "math/Vec3";
import {debounce} from "../../../../utils";
import gsap from 'gsap';


/**
 * Is touch device?
 */
const isTouchDevice = 'ontouchstart' in window

export class Character implements Updatable {

    ins: SketchBoxScene
    private current:{mesh:Object3D,body:CANNON.Body};
    private animationMixer: AnimationMixer;
    private animationName:string
    animationMap: Map<string, AnimationAction>;
    private controls: ThirdPersonControls;
    private moveTop: number=0;
    private moveRight: any=0;
    private keys: { a: { isDown: boolean }; s: { isDown: boolean }; d: { isDown: boolean }; w: { isDown: boolean }; space: { isDown: boolean } };
    private move: Boolean;
    private canJump: Boolean=true;
    private rotationY: number;
    private velocityQuaternion:Vector3=new Vector3(0,0,0)
    private temp:Quaternion

    constructor(ins: SketchBoxScene) {
        this.animationMap = new Map()
        this.ins = ins


        this.canJump = true
        this.move = false

        this.moveTop = 0
        this.moveRight = 0

        this.addKeys()
    }
    addKeys(){
        /**
         * Add Keys
         */
        this.keys = {
            w: { isDown: false },
            a: { isDown: false },
            s: { isDown: false },
            d: { isDown: false },
            space: { isDown: false }
        }

        const press = (e:KeyboardEvent, isDown:boolean) => {
            e.preventDefault()
            const { keyCode } = e
            switch (keyCode) {
                case 87: // w
                    this.keys.w.isDown = isDown
                    break
                case 83: // s
                    this.keys.s.isDown = isDown
                    break
                case 65: // a
                    this.keys.a.isDown = isDown
                    break
                case 68: // d
                    this.keys.d.isDown = isDown
                    break
            }
            this.calcCharacterForward()
            //根据按键情况计算任务朝向
            this.calcCharacterRotation()
        }

        document.addEventListener('keydown', e => press(e, true))
        document.addEventListener('keyup', e => press(e, false))
    }
    calcCharacterRotation(){
        //拿到相机朝向
        const characterDirection = new THREE.Vector3();
        this.current.mesh.getWorldDirection(characterDirection);

        const cameraDirection = new THREE.Vector3();
        this.ins.camera.getWorldDirection(cameraDirection);


        cameraDirection.setY(0).normalize();
        characterDirection.setY(0).normalize();

        //假设此时按下d按键
        cameraDirection.applyAxisAngle(new Vector3(0,1,0), this.directionOffset())

        let angle=this.getAngle(cameraDirection.x,cameraDirection.z)

        this.temp=new Quaternion().setFromAxisAngle(new Vector3(0,1,0),angle)

    }
    play(action:string){
        this.animationName=action
        // @ts-ignore
        this.animationMap.get(action).play()
    }
    getAngle(z:number, x:number) {
        let angle = Math.atan2(z, x);
        if (angle < 0) {
            angle += 2 * Math.PI;
        }
        return angle;
    }
    load() {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader(this.ins.loadMana);
            loader.load(
                boxMan,
                (res) => {
                    console.log("加载结果", res)
                    let t = res.scene.children[0]
                    const axesHelper = new THREE.AxesHelper(2); // 参数表示坐标轴的长度
                    t.add(axesHelper)

                    // t.scale.set(2, 2, 2)

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



                    const radius = 0.2; // 圆柱体底面半径
                    const height = 1; // 圆柱体高度
                    const cylinderShape = new CANNON.Cylinder(radius, radius, height, 8);

                    const body = new CANNON.Body({
                        mass: 1, // 质量
                        position: new CANNON.Vec3(0, 5, 0), // 位置
                        shape: cylinderShape, // 形状
                    });

                    // 设置旋转因子为零，阻止刚体旋转
                    body.angularFactor.set(0, 1, 0);

                    let p={
                        rotation:()=>{

                            // body.velocity.x=1


                            let q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), MathUtils.degToRad(90));
                            var direction = new THREE.Vector3(1, 0, 0); // 指向 x 轴的单位向量
                            direction.applyQuaternion(q);

                            console.log(direction.normalize())

                            // this.velocityQuaternion.z*=-1
                            // var force = new CANNON.Vec3(0.1, 0, 0);
                            // var worldPoint = new CANNON.Vec3(0.1, 0, 0); // 刚体的底部中心位置
                            // body.applyForce(force, worldPoint);

                            // gsap.to
                        },
                        jump:()=>{
                            body.velocity.y=4
                            const force = new CANNON.Vec3(0, 2, 0); // 在y轴上施加100的力
                            const bottomCenter = new CANNON.Vec3(0, -height/2, 0); // 圆柱体底部中心位置
                            body.applyForce(force, bottomCenter);
                        },
                        stop:()=>{
                            console.log("释放")
                            this.velocityQuaternion=new Vector3(0,0,0)
                            body.velocity.set(0, 0, 0); // 清除线性加速度
                        }
                    }
                    this.ins.dat.add(p,"rotation").name("旋转")
                    this.ins.dat.add(p,"jump").name("跳跃")
                    this.ins.dat.add(p,"stop").name("释放力度")

                    this.ins.physicsIns.world.addBody(body)

                    this.ins.scene.add(t)

                    this.play("idle")


                    this.controls = new ThirdPersonControls(this.ins.camera, t, {
                        offset: new Vector3(0, 1, 0),
                        //相机距离任务的距离
                        targetRadius: 3.5
                    })
                    // set initial view to 90 deg theta
                    this.controls.theta = 90

                    let canvas=this.ins.renderer.domElement


                    if (!isTouchDevice) {
                        let pl = new PointerLock(canvas)
                        let pd = new PointerDrag(canvas)
                        pd.onMove(delta => {
                            if (pl.isLocked()) {
                                // console.log(delta)
                                this.moveTop = -delta.y
                                this.moveRight = delta.x

                                // @ts-ignore
                                // f()

                            }
                        })
                    }

                    this.current={
                        body,
                        mesh:t
                    }
                    resolve(1)
                }
            )
        })
    }
    addTestBox(p:Vector3,color:string){
        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 33, 33),
            new THREE.MeshLambertMaterial({color:new Color("#f00")})
        );
        sphere.castShadow = true
        sphere.position.copy(p)
        this.ins.scene.add(sphere);
    }
    setRotation(rad:number){
        this.current.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),rad);
    }

    private directionOffset() {
        let keysPressed=this.keys
        let directionOffset = 0;
        if (keysPressed['w'].isDown) {
            if (keysPressed['d'].isDown) {
                directionOffset = (-Math.PI/2)+(Math.PI/4);
            } else if (keysPressed['a'].isDown) {
                directionOffset = (Math.PI/2)-(Math.PI/4);
            } else {
                directionOffset =0;
            }
        } else if (keysPressed['s'].isDown) {
            if (keysPressed['a'].isDown) {
                directionOffset = Math.PI * 3 / 4;
            } else if (keysPressed['d'].isDown) {
                directionOffset = -Math.PI * 3 / 4;
            } else {
                directionOffset =  Math.PI;
            }
        } else if (keysPressed['a'].isDown) {
            directionOffset = Math.PI / 2;
        } else if (keysPressed['d'].isDown) {
            directionOffset = -Math.PI / 2;
        }
        return directionOffset;
    }
    render(delta: number, elapsedTime: number): void {
        this.animationMixer.update(delta);
        if(this.current){
            /**
             * Update Controls
             */
            this.controls.update(this.moveRight * 3, -this.moveTop * 3)
            if (!isTouchDevice) this.moveRight = this.moveTop = 0
            /**
             * Player Turn
             */
            const speed = 4
            let {mesh:man,body}=this.current


            man.getWorldDirection(this.velocityQuaternion)


            if(this.velocityQuaternion){
                // this.velocityQuaternion.normalize()
                body.velocity.z=this.velocityQuaternion.z
                body.velocity.x=this.velocityQuaternion.x
            }


            // if(this.rotationY>0){
            //     man.rotation.y=MathUtils.lerp(man.rotation.y,this.rotationY,0.02)
            // }
            // man.rotateY(this.calcRotation())
            if(this.temp){
                man.quaternion.rotateTowards(this.temp,0.1)
            }
            // man.rotation.y = THREE.MathUtils.lerp(man.rotation.y,this.rotationY, 0.1); // 使用 lerp 进行插值

            // this.calcRotation()

            // let q=body.quaternion
            // man.quaternion.set(q.x,q.y,q.z,q.w)
            // let p=body.position
            // man.position.set(p.x,p.y,p.z)
            let p = body.position;
            // let targetPosition = new Vector3(p.x, p.y-0.22, p.z+0.1);
            let targetPosition = new Vector3(p.x, p.y-0.51, p.z);
            // man.position.lerp(targetPosition, 0.1);
            man.position.copy(targetPosition);
            /**
             * Player Jump
             */
            if (this.keys.space.isDown && this.canJump) {
                this.jump()
            }
        }
    }

    private jump() {
        let {mesh:man,body}=this.current

        if (!man || !this.canJump) return
        this.canJump = false
        // man.animation.play('jump_running', 500, false)
        this.play('jump')
        setTimeout(() => {
            this.canJump = true
            this.play('idle')
        }, 500)
        body.applyForce(new CANNON.Vec3(0,60,0),new CANNON.Vec3(0,-1.2,0))
    }

    private calcCharacterForward() {
        let keysPressed=this.keys
        let {body}=this.current
        if(keysPressed.w.isDown){
            // force.z -= moveForce;
        }
    }
}