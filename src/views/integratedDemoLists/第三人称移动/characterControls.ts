import {AnimationAction, AnimationClip, AnimationMixer, Camera, Group, Quaternion, Vector3} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export class CharacterControls {
    toggleRun: boolean = false
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

    fadeDuration = 0.2
    runVelocity = 5
    walkVelocity = 2

    constructor(currentAction: string, model: Group, mixer: AnimationMixer, animationsMap: Map<string, AnimationAction>, orbitControl: OrbitControls, camera: Camera) {
        this.currentAction = currentAction;
        this.model = model;
        this.mixer = mixer;
        this.animationsMap = animationsMap;
        this.orbitControl = orbitControl;
        this.camera = camera;
        //播放一开始的动画
        this.animationsMap.forEach((value, key) => {
            if (key === currentAction) {
                value.play()
            }
        })
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

        if (this.currentAction != play) {
            const toPlay = this.animationsMap.get(play)
            const current = this.animationsMap.get(this.currentAction)
            // @ts-ignore
            current.fadeOut(this.fadeDuration)
            // @ts-ignore
            toPlay.reset().fadeIn(this.fadeDuration).play()

            this.currentAction = play
        }

        if (this.currentAction == "run" || this.currentAction == "sprint") {
            let angleYCameraDirection = Math.atan2(
                (this.camera.position.x - this.model.position.x),
                (this.camera.position.z - this.model.position.z)
            )
            let directionOffset=this.directionOffset(keysPressed)
            //旋转模型
            this.rotateQuaternion.setFromAxisAngle(this.rotateAngle,angleYCameraDirection+directionOffset)
            this.model.quaternion.rotateTowards(this.rotateQuaternion,0.2)

            this.camera.getWorldDirection(this.walkDirection)
            this.walkDirection.y=0
            this.walkDirection.normalize()
            this.walkDirection.applyAxisAngle(this.rotateAngle,directionOffset)

            const velocity=this.currentAction=='run'?this.runVelocity:this.walkVelocity

            const moveX=this.walkDirection.x * velocity * delta
            const moveZ=this.walkDirection.z * velocity * delta
            this.model.position.x+=moveX
            this.model.position.z+=moveZ

            this.updateCameraTarget(moveX,moveZ)
        }

        this.mixer.update(delta)
    }

    private directionOffset(keysPressed: any) {
        let directionOffset=0;
        if(keysPressed['w']){
            if(keysPressed['a']){
                directionOffset=Math.PI/4
            }else if(keysPressed['d']){
                directionOffset=-Math.PI/4
            }
        }else if(keysPressed['s']){
            if(keysPressed['a']){
                directionOffset=Math.PI/4 + Math.PI/2
            }else if(keysPressed['d']){
                directionOffset=-Math.PI/4 - Math.PI/2
            }else{
                directionOffset=Math.PI
            }
        }else if(keysPressed['a']){
            directionOffset=Math.PI/2
        }else if(keysPressed['d']){
            directionOffset=-Math.PI/2
        }
        return directionOffset
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