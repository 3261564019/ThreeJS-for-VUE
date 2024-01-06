import {SketchBoxScene} from "../SketchBoxScene";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import boxMan from "@/assets/model/box_man.glb?url";
import {AnimationAction, AnimationMixer, Color, MathUtils, Object3D, Quaternion, Vector3} from "three";
import {KeyAction, Updatable} from "../type";
import * as CANNON from "cannon-es";
// @ts-ignore
import {threeToCannon} from "./three-to-cannon.js"
import {ThirdPersonControls} from "./thirdPersonControls";
import {PointerDrag} from "enable3d";
import * as THREE from "three";
import {createBoxManBody} from "../hooks/body/character";
import {captureBoxMan} from "../hooks/mesh/character";
import {AnimationControl} from "./animationControl";
import {timeOut} from "../../../../utils";
import gsap from 'gsap';
import {PointerLock} from "./PointerLock";


/**
 * Is touch device?
 */
const isTouchDevice = 'ontouchstart' in window

console.log("isTouchDevice",isTouchDevice)
export class Character implements Updatable {

    ins: SketchBoxScene
    private current:{mesh:Object3D,body:CANNON.Body};
    private animationMixer: AnimationMixer;
    private controls: ThirdPersonControls;
    private moveTop: number=0;
    private moveRight: any=0;
    private keys:KeyAction;
    //刚体的速率
    private velocityQuaternion:Vector3=new Vector3(0,0,0)
    //人物的朝向
    private forwardQuaternion: Quaternion;
    //动画控制器
    private aControl:AnimationControl
    //是否初始化完成，可以进行渲染
    private initEd:Boolean


    //是否能进行跳跃为false代表正在播放跳跃的动画
    public canJump: boolean=true;
    //是否在移动，即按wasd
    private move:boolean=false
    //角色刚体是否在睡眠
    private sleeping:Boolean=false
    //起跳时，是否同时有按方向键
    private jumpMove:boolean|null=null

    constructor(ins: SketchBoxScene) {
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
                    this.walk()
                    break
                case 83: // s
                    this.keys.s.isDown = isDown
                    this.walk()
                    break
                case 65: // a
                    this.keys.a.isDown = isDown
                    this.walk()
                    break
                case 68: // d
                    this.keys.d.isDown = isDown
                    this.walk()
                    break
                case 32: // 空格
                    //能进行跳跃，且按下了空格键
                    if(this.canJump && isDown){
                        this.jumpMove=this.checkMove()
                        /**
                         * 因为在渲染时判断的这个字段，如果为false意为在空中，会加加速度
                         * 单独起跳不需要加加速度，因此判断是否单独起跳需要在更新canJump前
                         */
                        this.canJump=false
                        this.keys.space.isDown = isDown
                        this.jump()
                    }
                    break
            }

            this.checkMove()
            /**
             * 如果键盘松开时没有在移动，也不在跳跃过程中需要执行stop动画
             */
            if(!isDown && !this.move && this.canJump){
                this.aControl.stop()
            }
            //计算人物移动的力度
            this.calcCharacterForward()
            //根据按键情况计算任务朝向
            this.calcCharacterRotation()
        }

        document.addEventListener('keydown', e => press(e, true))
        document.addEventListener('keyup', e => press(e, false))
    }
    //wasd是否按下
    checkMove(){
        let keys=this.keys
        this.move = keys.w.isDown || keys.a.isDown || keys.s.isDown || keys.d.isDown;
        return this.move
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

                    t.rotateY(MathUtils.degToRad(-90))

                    captureBoxMan(t)

                    // @ts-ignore
                    this.animationMixer = new AnimationMixer(res.scene);

                    let map=new Map()
                    //将动画存到map中，动画名作为key方便调用
                    res.animations.forEach(v => {
                        map.set(v.name, this.animationMixer.clipAction(v))
                    })

                    let body=createBoxManBody()
                    body.material=this.ins.physicsIns.cmm.getMaterial("character")

                    this.aControl=new AnimationControl(map,this.animationMixer,this)
                    this.aControl.init()


                    this.ins.physicsIns.world.addBody(body)

                    this.ins.scene.add(t)


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
                            }
                        })
                    }

                    body.addEventListener("sleepy",()=>{
                        console.log("进入睡眠")
                        this.sleeping=true

                        body.force.set(0, 0, 0);
                        body.torque.set(0, 0, 0);
                        body.velocity.set(0, 0, 0);
                        body.angularVelocity.set(0, 0, 0);
                    })
                    body.addEventListener("wakeup",()=>{
                        console.log("刚体唤醒")
                        this.sleeping=false

                    })

                    this.current={
                        body,
                        mesh:t
                    }

                    this.addDebug()

                    this.initEd=true
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
        man.position.lerp(targetPosition, 0.5);
        // man.position.copy(targetPosition);
    }
    render(delta: number, elapsedTime: number): void {
        if(this.initEd){

            this.controls.update(this.moveRight * 3, -this.moveTop * 3)
            if (!isTouchDevice) this.moveRight = this.moveTop = 0


            let {mesh:man,body}=this.current



            //滞空或者行走时施加速度
            if(this.move || !this.canJump){
                let scale=5

                //如果在跳跃,力度需要小一些
                if(!this.canJump){
                    scale=2
                }
                /**
                 * 保证原地起跳时位置不移动
                 */
                if(!this.jumpMove){
                    scale=0
                }

                body.velocity.z=this.velocityQuaternion.z*scale
                body.velocity.x=this.velocityQuaternion.x*scale
            }

            //如果有计算得出的人物朝向，并且有在按方向键，人物需要转向方向键的方向
            if(this.move && this.forwardQuaternion){
                //获取人物的朝向
                man.getWorldDirection(this.velocityQuaternion)
                man.quaternion.rotateTowards(this.forwardQuaternion,0.5)
            }

            //更新旋转和位置
            this.updateMeshBody(body,man)
            this.aControl.render(delta,elapsedTime)
            //更新鼠标控制器
            this.controls.update(this.moveRight * 3, -this.moveTop * 3)
        }
    }

    private walk() {
        this.jumpMove=true
        //如果在睡眠需要施加一定的力进行唤醒
        if(this.sleeping){
            let body=this.current.body
            const force = new CANNON.Vec3(0, 1, 0); // 在y轴上施加100的力
            const bottomCenter = new CANNON.Vec3(0, -0.5, 0); // 圆柱体底部中心位置
            body.applyForce(force, bottomCenter);
        }
        this.aControl.walk()
    }
    private jump() {
        let body=this.current.body
        body.velocity.y=4
        const force = new CANNON.Vec3(0, 9, 0); // 在y轴上施加100的力
        const bottomCenter = new CANNON.Vec3(0, -0.5, 0); // 圆柱体底部中心位置
        this.aControl.jump()
        body.applyForce(force, bottomCenter);
        //跳跃动画播一次大约需要1s，此处需要冗余
        timeOut(()=>{
            this.canJump=true
        },1010)
    }

    private calcCharacterForward() {
        let keysPressed=this.keys
        let {body}=this.current
        if(keysPressed.w.isDown){
            // force.z -= moveForce;
        }
    }

    private addDebug() {

        let p={
            rotation:()=>{

            },
            jump:()=>{
                this.jump()
            },
            stop:()=>{
                console.log("释放")
                this.velocityQuaternion=new Vector3(0,0,0)
                this.current.body.velocity.set(0, 0, 0); // 清除线性加速度
            }
        }
        this.ins.dat.add(p,"rotation").name("旋转")
        this.ins.dat.add(p,"jump").name("跳跃")
        this.ins.dat.add(p,"stop").name("释放力度")
    }
}