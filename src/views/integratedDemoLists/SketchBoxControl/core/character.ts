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
import {createBoxManBody} from "../hooks/body/character";
import {captureBoxMan} from "../hooks/mesh/character";


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

    private move: Boolean=false;
    //是否能进行跳跃
    private canJump: Boolean=true;

    private velocityQuaternion:Vector3=new Vector3(0,0,0)
    private forwardQuaternion: Quaternion;

    constructor(ins: SketchBoxScene) {
        this.animationMap = new Map()
        this.ins = ins


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
                case 32: // 空格
                    if(this.canJump){
                        this.canJump=false
                        this.keys.space.isDown = isDown
                        this.jump()
                    }
                    break
            }
            //计算人物移动的力度
            this.calcCharacterForward()
            //根据按键情况计算任务朝向
            this.calcCharacterRotation()
        }

        document.addEventListener('keydown', e => press(e, true))
        document.addEventListener('keyup', e => press(e, false))
    }
    calcCharacterRotation(){
        //拿到人物朝向
        const characterDirection = new THREE.Vector3();
        this.current.mesh.getWorldDirection(characterDirection);
        //拿到相机朝向
        const cameraDirection = new THREE.Vector3();
        this.ins.camera.getWorldDirection(cameraDirection);
        //归一化
        cameraDirection.setY(0).normalize();
        characterDirection.setY(0).normalize();

        //相机的朝向加上按键指向的方向的偏移
        cameraDirection.applyAxisAngle(new Vector3(0,1,0), this.directionOffset())
        //通过偏移量拿到人物应该旋转的下角度
        let angle=this.getAngle(cameraDirection.x,cameraDirection.z)
        this.forwardQuaternion=new Quaternion().setFromAxisAngle(new Vector3(0,1,0),angle)

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
                    let t =res.scene.children[0];
                    captureBoxMan(t)

                    // @ts-ignore
                    this.animationMixer = new AnimationMixer(res.scene);

                    let temp = {}
                    //将动画存到map中，动画名作为key方便调用
                    res.animations.forEach(v => {
                        // @ts-ignore
                        temp[v.name] = v.name
                        this.animationMap.set(v.name, this.animationMixer.clipAction(v))
                    })

                    let body=createBoxManBody()


                    // 设置旋转因子为零，阻止刚体旋转

                    let p={
                        rotation:()=>{

                        },
                        jump:()=>{
                            this.jump()
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

    /**
     * 根据刚体位置更新网格位置
     * 根据网格旋转更新刚体的旋转
     */
    updateMeshBody(body:CANNON.Body,man:Object3D){
        let p = body.position;
        let targetPosition = new Vector3(p.x, p.y-0.22, p.z);
        let meshQ=man.quaternion
        body.quaternion=new CANNON.Quaternion(
            meshQ.x,
            meshQ.y,
            meshQ.z,
            meshQ.w
        );
        // let targetPosition = new Vector3(p.x, p.y-0.51, p.z);
        // man.position.lerp(targetPosition, 0.1);
        man.position.copy(targetPosition);
    }
    render(delta: number, elapsedTime: number): void {
        this.animationMixer.update(delta);
        if(this.current){
            /**
             * Update Controls
             */
            this.controls.update(this.moveRight * 3, -this.moveTop * 3)
            if (!isTouchDevice) this.moveRight = this.moveTop = 0

            let {mesh:man,body}=this.current

            //获取人物的朝向
            man.getWorldDirection(this.velocityQuaternion)

            //如果有刚体加速度
            if(this.velocityQuaternion){
                body.velocity.z=this.velocityQuaternion.z*2
                body.velocity.x=this.velocityQuaternion.x*2
            }

            //如果有计算得出的人物朝向，
            if(this.forwardQuaternion){
                man.quaternion.rotateTowards(this.forwardQuaternion,0.2)
            }
            //更新旋转和位置
            this.updateMeshBody(body,man)
        }
    }

    private jump() {
        let body=this.current.body
        body.velocity.y=4
        const force = new CANNON.Vec3(0, 2, 0); // 在y轴上施加100的力
        const bottomCenter = new CANNON.Vec3(0, -0.5, 0); // 圆柱体底部中心位置
        body.applyForce(force, bottomCenter);
        setTimeout(()=>{
            this.canJump=true
        },860)
    }

    private calcCharacterForward() {
        let keysPressed=this.keys
        let {body}=this.current
        if(keysPressed.w.isDown){
            // force.z -= moveForce;
        }
    }
}