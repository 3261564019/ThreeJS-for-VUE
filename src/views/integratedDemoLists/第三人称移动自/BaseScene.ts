import * as THREE from "three";
import {
    AnimationAction,
    AnimationClip,
    AnimationMixer, BoxGeometry,
    BufferGeometry, BufferGeometryUtils, CatmullRomCurve3,
    Clock,
    Color,
    Group,
    Mesh,
    MeshLambertMaterial, Object3D, Quaternion,
    Raycaster,
    Vector3
} from "three";
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import boxMan from "@/assets/model/box_man.glb?url";
import {Intersection} from "three/src/core/Raycaster";
import {gsap, Power1} from 'gsap';
import {CharacterControls} from "./characterControls";
import {UsePointLock} from "./usePointLock";

const  keysPressed={}

export class BaseScene extends BaseInit {
    animationMixer: AnimationMixer
    clock: Clock;
    debugData: {
        rotation: () => void;
        testCurve: () => void;
        reSetCameraPosition: () => void;
        calcPosition: () => void;
        actionName: string
    };
    animationMap: Map<string, AnimationAction>;
    boxMan: Group
    cameraTargetPosition: Vector3 | null
    rayCaster: Raycaster;
    //当前鼠标偏移量
    mouseCoords: THREE.Vector2 = new THREE.Vector2(2, 2);

    tempBox: Mesh;

    rayObj: Intersection

    personControl: CharacterControls
    private keydown: (e: KeyboardEvent) => void;
    private keyup: OmitThisParameter<(e: KeyboardEvent) => void>;
    private pointIns:any;


    constructor() {
        super({
            needLight: false,
            renderDomId: "#renderDom",
            needOrbitControls: true,
            adjustScreenSize: true,
            needAxesHelper: true,
            calcCursorPosition: true,
        } as BaseInitParams);

        this.control.minDistance = 5
        this.control.maxDistance = 15
        this.control.enableDamping=false
        this.control.maxPolarAngle = Math.PI / 2 - 0.05
        this.control.update();

        this.clock = new Clock();

        // @ts-ignore
        this.debugData = {
            //当前执行的动作名称
            actionName: "",
            // calcPosition: this.calcCameraPosition.bind(this)
            //计算相机位置的回调
        }

        this.initDebug();

        this.init();

        this.loadModel()

        this.addPlan();

        this.addLight();

        this.addBall();
        this.initRayCaster()

        this.pointIns=UsePointLock(this)

        this.animate();
        // this.addTempBox();

        // window.addEventListener("click", this.onClick.bind(this))

        this.addKeyEvent();

        const angle = Math.atan2(0, 10); // 返回的角度是弧度值
        const degrees = angle * (180 / Math.PI); // 将弧度转换为度数
        console.log("度数",degrees)


        this.debugData.rotation=()=>{
            // let rotateQuaternion=new Quaternion()
            // rotateQuaternion.setFromAxisAngle(new Vector3(0,0,1),Math.PI/2)
            // this.boxMan.quaternion.rotateTowards(rotateQuaternion,1)
            let t=new Vector3(1,0,0)
            t.normalize()
            t.applyAxisAngle(new Vector3(0,1,0),Math.PI)
            console.log(Math.abs(t.z))
            console.log("ttt",t)
        }
        this.dat.add(this.debugData, "rotation").name("模型旋转");

    }

    onClick() {
        console.log(this.rayObj)
        console.log("人物位置", this.boxMan)

        const boundingBox = new THREE.Box3().setFromObject(this.boxMan);
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        console.log("大小", size)

        let man = this.boxMan.position.clone()
        // man.y += 30
        // 从人物指向目标点的方向向量
        let ab = new THREE.Vector3().subVectors(this.rayObj.point, man);
        // 将方向向量反向，以便让相机位于人物的背面
        ab.negate();
        let abLength = ab.length();
        // ab.normalize();
        let distanceFromA = 20;
        let ac = ab.multiplyScalar(distanceFromA / abLength);
        let c = new THREE.Vector3().addVectors(this.boxMan.position, ac);
        if (c.y > 18) {
            c.y = 18
        }
        if (c.y < 10) {
            c.y = 10
        }

        const path = {
            path: [
                this.camera.position.clone(), // 相机当前位置
                c.clone()
            ],
            curviness: 40, // 曲线的曲率，调整这个值可以改变路径的弧度
        };

        gsap.to(this.camera.position, {
            duration: 1,
            motionPath: path,
            ease: Power1.easeInOut, // 使用缓动函数控制速度由快至慢
            onComplete: function () {
                // 动画完成时执行的操作
                console.log("Animation completed");
            }
        });

        let start = this.boxMan.quaternion.clone()
        const target = this.rayObj.point; // 目标点的坐标
        const duration = 1; // 动画时长（秒）
        const quaternion = new Quaternion(); // 创建一个四元数用于存储旋转结果
        this.boxMan.lookAt(target); // 使用 lookAt 旋转角色至目标点
        quaternion.copy(this.boxMan.quaternion); // 复制当前的旋转状态
        this.boxMan.quaternion.copy(start); // 将角色的旋转重置为默认状态

        gsap.to(this.boxMan.quaternion, { // 使用 gsap 实现过渡效果
            x: quaternion.x,
            y: quaternion.y,
            z: quaternion.z,
            w: quaternion.w,
            duration: duration,
            onUpdate: () => {
                // 在每一帧更新模型的顶点法线
            }
        });
    }

    addTempBox() {
        this.tempBox = new Mesh(new BoxGeometry(2, 2, 2), new MeshLambertMaterial({color: "#447152"}))
        this.scene.add(this.tempBox);
    }

    initRayCaster() {
        this.rayCaster = new Raycaster()
        window.addEventListener("mousemove", this.mouseMoveCallBack.bind(this))
    }

    mouseMoveCallBack(event: { clientX: number; clientY: number; }) {
        this.mouseCoords.x = (event.clientX / this.screenSize.x * 2) - 1
        this.mouseCoords.y = -(event.clientY / this.screenSize.y * 2) + 1
    }
    addPlan() {

        const geometry = new THREE.PlaneGeometry(40, 40);
        const material = new THREE.MeshLambertMaterial({color: 0xcccccc});

        const plane = new THREE.Mesh(geometry, material);
        plane.name = "groundPlane"
        //设置接受阴影
        plane.receiveShadow = true

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        //添加地板容器
        this.scene.add(plane);

    }

    loadModel() {
        let loader = new GLTFLoader()
        this.animationMap = new Map();
        loader.load(boxMan, (e) => {
            console.log("加载结果", e)
            let res = e.scene
            res.name = "boxMan"
            res.scale.set(5, 5, 5)
            // @ts-ignore
            res.traverse((child: THREE.Mesh) => {
                if (child.isMesh) {
                    const material = child.material as THREE.MeshStandardMaterial;
                    child.castShadow = true;
                    child.receiveShadow = true;
                    material.roughness = 1;
                    material.metalness = 0;
                    material.color = new Color("#fff");
                }
            })

            this.animationMixer = new AnimationMixer(res);

            let temp = {}
            //将动画存到map中，动画名作为key方便调用
            e.animations.forEach(v => {
                // @ts-ignore
                temp[v.name] = v.name
                this.animationMap.set(v.name, this.animationMixer.clipAction(v))
            })
            // res.rotation.y=Math.PI
            this.scene.add(res)



            this.dat.add(this.debugData, "actionName", temp).onFinishChange(
                // @ts-ignore
                e => {
                    this.animationMixer.stopAllAction(); // 停止所有正在播放的动画
                    // const action = this.animationMixer.clipAction(this.animationMap.get(e));
                    let action=this.animationMap.get(e)
                    // @ts-ignore
                    action.play()
                    // action.setLoop(THREE.LoopOnce, 0); // 设置循环模式为只播放一次
                    // action.clampWhenFinished = true; // 动画结束后保持在最后一帧
                    // action.play();

                    console.log("q", e)
                }
            ).name("动画")

            res.rotation.y=Math.PI
            this.boxMan = res

            console.log("动画列表", this.animationMap)

            this.control.enableDamping=true
            this.personControl = new CharacterControls('idle', this.boxMan, this.animationMixer, this.animationMap, this.control, this.camera)
        })
    }

    addLight() {

        //创建聚光灯
        const light = new THREE.SpotLight("#fff");
        light.castShadow = true;            // default false
        light.position.x = 20;
        light.position.y = 30;
        this.scene.add(light);


        const alight = new THREE.AmbientLight("#fff", 0.6);
        this.scene.add(alight);

    }

    addBall() {

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(3, 33, 33),
            new THREE.MeshLambertMaterial({color: "#fff"})
        );

        sphere.position.x = 10;
        sphere.position.y = 2;
        sphere.castShadow = true

        this.scene.add(sphere);
    }

    init() {

        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.9;
        this.renderer.outputEncoding = THREE.LinearEncoding;

        // this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 180, 180)
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

    }

    calcIntersect() {

        let arr = this.rayCaster.intersectObjects(this.scene.children, true);

        if (arr.length) {
            // console.log("相交物体",arr)
            if (arr[0]) {
                // let p=arr[0].point;

                this.rayObj = arr[0]
                // this.tempBox.position.copy(p)
                // console.log("目标位置",p)
                // this.boxMan.lookAt(p)
                // this.calcCameraPosition()
            }
        }
    }

    animate() {

        let delta=this.clock.getDelta()

        if(this.personControl){
            this.personControl.update(delta,keysPressed)
        }

        //根据鼠标位置更新射线坐标
        this.rayCaster.setFromCamera(this.mouseCoords, this.camera);
        //统计相交物体
        this.calcIntersect()
        this.stats.update()

        if (this.animationMixer) {
            this.animationMixer.update(delta);
        }

        this.pointIns.render(delta)
        // console.log(this.camera.position)
        // console.log(this.boxMan.position)
        this.control.update()
        this.renderer.render(this.scene, this.camera);
        this.raf = requestAnimationFrame(this.animate.bind(this));
    }

    destroy() {
        super.destroy();
        this.pointIns.destroy()
        document.removeEventListener("keydown", this.keydown)
        document.removeEventListener("keyup", this.keyup)
    }

    private addKeyEvent() {
        //键盘按下
        this.keydown=((e: KeyboardEvent)=>{
            if (e.shiftKey && this.personControl) {
                this.personControl.switchRunToggle()
            } else {
                (keysPressed as any)[e.key.toLowerCase()] = true
            }
        }).bind(this)

        //键盘弹起
        this.keyup=((e: KeyboardEvent)=>{
            (keysPressed as any)[e.key.toLowerCase()]=false

        }).bind(this)

        document.addEventListener("keydown",this.keydown, false)
        document.addEventListener("keyup",this.keyup, false)
    }

}