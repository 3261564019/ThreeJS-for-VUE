import {AnimationAction, AnimationClip, AnimationMixer, Camera, Clock, Group, Quaternion, Vector3} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {BaseScene} from "./BaseScene";
import * as THREE from "three";

export class CharacterControls {
    //是否在冲刺
    toggleRun: boolean = false
    //当前正在播放的动画
    currentAction: string
    model: Group
    mixer: AnimationMixer
    animationsMap: Map<string, AnimationAction> = new Map()
    orbitControl: OrbitControls
    camera: Camera

    walkDirection = new Vector3()
    rotateAngle = new Vector3(0, 1, 0)
    rotateQuaternion = new Quaternion()
    cameraTarget = new Vector3()
    //动作切换的间隔
    fadeDuration = 0.2
    runVelocity = 10
    walkVelocity = 4


    constructor(currentAction: string, model: Group, mixer: AnimationMixer, animationsMap: Map<string, AnimationAction>, orbitControl: OrbitControls, camera: Camera,ins:BaseScene) {
        this.currentAction = currentAction;
        this.model = model;
        this.mixer = mixer;
        this.animationsMap = animationsMap;
        this.orbitControl = orbitControl;
        this.camera = camera;
        //播放一开始的动画
        this.animationsMap.forEach((value, key) => {
            value.setLoop(THREE.LoopOnce,1)
            if (key === currentAction) {
                value.play()
            }
        })

        let temp={
            fade:()=>{
                // this.mixer.stopAllAction(); // 停止所有正在播放的动画


                console.log("aaa")
                //jump_idle  falling  stop
                // 创建 AnimationAction 并添加到 AnimationMixer 中
                const action1 = this.animationsMap.get("jump_idle");
                const action2 = this.animationsMap.get("falling");
                const action3 = this.animationsMap.get("stop");
                let arr=[action1,action2,action3]

                arr.forEach(e=>{
                    e.reset(); // 重置动画状态到初始帧
                })


                const idle = this.animationsMap.get("idle");



                /**
                 * fadeIn   在传入的时间间隔内，逐渐将此动作的权重（weight）由0升到1。
                 * fadeOut  在传入的时间间隔内，逐渐将此动作的权重（weight）由1降至0。此方法可链式调用
                 */
                //让第一个动画播放慢一点，保证和滞空时手的位置对上，不至于举太高
                action1.setEffectiveTimeScale(0.8);
                //动画3的持续时间是0.66s 将其加快1.2倍也就是 0.528s播完
                action3.setEffectiveTimeScale(1.2);

                idle.play()
                idle.crossFadeTo(action1, 0.3, false);

                let t0=setTimeout(()=>{

                // 播放起跳动画
                action1.play();
                let t1=setTimeout(()=>{
                    // 过渡两个动画的权重，并开始播放第二个动画
                    // 此时因为过渡的原因，动画1会经过3s平滑的到2
                    action1.crossFadeTo(action2, 0.4, false);
                    action2.play()
                    let t2=setTimeout(()=>{

                        if(this)

                        // 过渡到落地动画并设置过渡时间为0.3秒
                        action2.crossFadeTo(action3, 0.3, false);
                        action3.play()

                        clearTimeout(t2)
                    },400)

                    clearTimeout(t1)
                },300)
            },300)


                // 第一个定时器的0.4，第二个0.3s，第三个需要0.52 该动作共需要 1.22s

            }
        }


        ins.dat.add(temp,"fade").name("过渡")
        console.log("哈哈哈",this.directionOffset({w:true}))
    }

    public switchRunToggle() {
        this.toggleRun = !this.toggleRun
    }

    public update(delta: number, keysPressed: any) {
        const directionPressed = ["w", "s", "a", "d"].some(key => keysPressed[key] == true)

        let play = ''

        if (directionPressed && this.toggleRun) {
            play = 'sprint'
        } else if (directionPressed) {
            play = 'run'
        } else {
            play = 'idle'
        }
        //如果当前播放的动画和应该播放的动画不一致需要切换
        if (this.currentAction != play) {
            const toPlay = this.animationsMap.get(play)
            const current = this.animationsMap.get(this.currentAction)
            // @ts-ignore
            current.fadeOut(this.fadeDuration)
            // @ts-ignore
            toPlay.reset().fadeIn(this.fadeDuration).play()
            //更新当前动画
            this.currentAction = play
        }

        if (this.currentAction == "run" || this.currentAction == "sprint") {
            //计算相机转向人物需要旋转的角度
            let angleYCameraDirection = Math.atan2(
                (this.camera.position.x - this.model.position.x),
                (this.camera.position.z - this.model.position.z)
            )
            let directionOffset=this.directionOffset(keysPressed)
            //旋转模型
            this.rotateQuaternion.setFromAxisAngle(this.rotateAngle,angleYCameraDirection+directionOffset)
            this.model.quaternion.rotateTowards(this.rotateQuaternion,0.2)
            /**
             * 通过该方法拿到相机朝向，如果相机位于5,5,5的位置，看向10,10,10的位置，该方法结果是 0.5,0.5,0.5
             * 如果相机位于5,5,5看向0,0,0该方法结果为-0.5,-0.5,-0.5
             */
            this.camera.getWorldDirection(this.walkDirection)
            this.walkDirection.y=0
            this.walkDirection.normalize()
            this.walkDirection.applyAxisAngle(this.rotateAngle,directionOffset)

            const velocity=this.currentAction=='sprint'?this.runVelocity:this.walkVelocity

            const moveX=-this.walkDirection.x * velocity * delta
            const moveZ=-this.walkDirection.z * velocity * delta
            this.model.position.x+=moveX
            this.model.position.z+=moveZ

            this.updateCameraTarget(moveX,moveZ)
        }

        this.mixer.update(delta/3)
    }

    private directionOffset(keysPressed: any) {
        let directionOffset = 0;
        if (keysPressed['w']) {
            if (keysPressed['a']) {
                directionOffset = Math.PI * 5 / 4;
            } else if (keysPressed['d']) {
                directionOffset = -Math.PI * 5 / 4;
            } else {
                directionOffset = Math.PI;
            }
        } else if (keysPressed['s']) {
            if (keysPressed['a']) {
                directionOffset = Math.PI * 3 / 4;
            } else if (keysPressed['d']) {
                directionOffset = -Math.PI * 3 / 4;
            } else {
                directionOffset = 0;
            }
        } else if (keysPressed['a']) {
            directionOffset = -Math.PI / 2;
        } else if (keysPressed['d']) {
            directionOffset = Math.PI / 2;
        }

        return directionOffset;
    }

    private updateCameraTarget(moveX:number, moveZ:number){
        this.camera.position.x+=moveX
        this.camera.position.z+=moveZ
        this.cameraTarget.x=this.model.position.x
        this.cameraTarget.y=this.model.position.y+1
        this.cameraTarget.z=this.model.position.z
        this.orbitControl.target=this.cameraTarget
    }
}