import * as THREE from "three";
import {
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
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// 注册MotionPath插件
gsap.registerPlugin(MotionPathPlugin);
export class BaseScene extends BaseInit {
    animationMixer: AnimationMixer
    clock: Clock;
    debugData: {
        testCurve: () => void;
        reSetCameraPosition: () => void;
        calcPosition: () => void;
        actionName: string
    };
    animationMap: Map<string, AnimationClip>;
    boxMan: Group
    cameraTargetPosition: Vector3 | null
    rayCaster: Raycaster;
    //当前鼠标偏移量
    mouseCoords: THREE.Vector2 = new THREE.Vector2(2, 2);

    tempBox: Mesh;

    rayObj: Intersection

    constructor() {
        super({
            needLight: false,
            renderDomId: "#renderDom",
            needOrbitControls: true,
            adjustScreenSize: true,
            needAxesHelper: false,
            calcCursorPosition: true,
        } as BaseInitParams);

        this.clock = new Clock();

        // @ts-ignore
        this.debugData = {
            //当前执行的动作名称
            actionName: "",
            calcPosition: this.calcCameraPosition.bind(this)
            //计算相机位置的回调
        }

        this.initDebug();

        this.init();

        this.loadModel()

        this.addPlan();

        this.addLight();

        this.addBall();
        this.initRayCaster()

        this.animate();
        this.addTempBox();
        this.addCalcCameraPositionDebug();

        // window.addEventListener("click", this.onClick.bind(this))
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

        let start=this.boxMan.quaternion.clone()
        const target = this.rayObj.point; // 目标点的坐标
        const duration =1; // 动画时长（秒）
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

    // 根据人物朝向，计算出相机的位置
    calcCameraPosition() {
        const character = this.boxMan
        // 计算相机的位置
        const distance = 20; // 相机与人物的距离
        const characterDirection = character.rotation.y; // 获取人物的朝向角度
        // 计算相机的位置

        this.cameraTargetPosition = new THREE.Vector3(
            character.position.x - Math.sin(characterDirection) * distance,
            character.position.y + 15, // 相机的高度
            character.position.z - Math.cos(characterDirection) * distance
        )
    }

    addCalcCameraPositionDebug() {
        this.debugData.reSetCameraPosition = () => {
            // this.camera.position.set(0, 40, 40)
            this.tempBox.position.set(0,0,20)
        }
        this.debugData.testCurve = () => {

            /**
             * 1、生成轨迹曲线
             * 2、渲染时有轨迹线则根据线段向指定位置移动，在接近目标位置时速度放缓
             * 3、运动过程中如果目标点发送变化需要清楚当前移动的状态，设置新状态，以便将相机移动至新地点
             */

            // const path = {
            //     path: [
            //         new Vector3(0,0,20),
            //         new Vector3(20,0,0),
            //         new Vector3(0,0,-20)
            //     ]
            // };
            //
            // gsap.to(this.tempBox.position, {
            //     duration:3,
            //     motionPath: path,
            //     ease: Power1.easeInOut, // 使用缓动函数控制速度由快至慢
            //     onUpdate: () => {
            //         // 在每一帧更新模型的顶点法线
            //         // this.camera.lookAt(0,5,0)
            //         console.log("更新")
            //     },
            //     onComplete: function () {
            //         // 动画完成时执行的操作
            //         console.log("Animation completed");
            //     }
            // });


                //用Catmull-Rom算法， 从一系列的点创建一条平滑的三维样条曲线
            const curve = new CatmullRomCurve3( [
                    new Vector3(0,0,20),
                    new Vector3(20,0,0),
                    new Vector3(0,0,-20)
                    // new THREE.Vector3(  - 20, 0, - 20,)
                ] );
            //让曲线自动闭合
            curve.closed=false;
            //取该曲线平均距离的100个点的位置
            const points = curve.getPoints( 100 );
            //通过点队列设置该 BufferGeometry 的 attribute。
            const geometry = new THREE.BufferGeometry().setFromPoints( points );
            //线条材质
            const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
            //创建图形并加入场景
            const curveObject = new THREE.Line( geometry, material );
            this.scene.add(curveObject);

        }
        this.dat.add(this.debugData, "calcPosition").name("计算相机位置");
        this.dat.add(this.debugData, "reSetCameraPosition").name("重置相机位置");
        this.dat.add(this.debugData, "testCurve").name("临时测试曲线");
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
            let temp = {}
            //将动画存到map中，动画名作为key方便调用
            e.animations.forEach(v => {
                // @ts-ignore
                temp[v.name] = v.name
                this.animationMap.set(v.name, v)
            })


            this.animationMixer = new AnimationMixer(res);
            this.scene.add(res)

            const action = this.animationMixer.clipAction(e.animations[0]);
            action.play();


            this.dat.add(this.debugData, "actionName", temp).onFinishChange(
                // @ts-ignore
                e => {
                    this.animationMixer.stopAllAction(); // 停止所有正在播放的动画
                    const action = this.animationMixer.clipAction(this.animationMap.get(e) as AnimationClip);

                    action.setLoop(THREE.LoopOnce, 0); // 设置循环模式为只播放一次
                    action.clampWhenFinished = true; // 动画结束后保持在最后一帧
                    action.play();

                    console.log("q", e)
                }
            ).name("动画")


            this.boxMan = res

            console.log("动画列表", this.animationMap)
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

        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 20, 20)
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

        if (this.animationMixer) {
            this.animationMixer.update(this.clock.getDelta());
        }
        if (this.boxMan) {
            this.camera.lookAt(this.boxMan.position)
        }
        if (this.cameraTargetPosition) {
            let delta = 1;
            let speed = 0.46; // 适当调整速度系数

            // 计算相机位置的增量
            let direction = new THREE.Vector3();
            // 通过subVectors()方法将目标位置减去相机位置，得到从相机位置出发指向目标位置的向量
            direction.subVectors(this.cameraTargetPosition, this.camera.position).normalize();
            // 计算当前位置距目标位置的距离
            let distance = this.camera.position.distanceTo(this.cameraTargetPosition);
            // displacement表示了相机在当前帧应该沿着方向向量移动的位移量。
            let displacement = direction.multiplyScalar(Math.min(distance, speed * delta));
            // 将相机的当前位置与位移向量displacement相加，以实现相机沿着方向向量移动指定的距离。
            this.camera.position.add(displacement);

            if (distance <= displacement.length()) { // 判断相机是否已经接近目标位置
                this.camera.position.copy(this.cameraTargetPosition); // 将相机位置直接设置为目标位置
                this.cameraTargetPosition = null; // 清空目标位置
            } else {
                this.camera.position.add(displacement); // 更新相机位置
            }
        }

        // this.rayCaster.setFromCamera( mouse, this.camera );

        this.rayCaster.setFromCamera(this.mouseCoords, this.camera);
        //统计相交物体
        this.calcIntersect()


        this.stats.update()
        this.raf = requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        super.destroy();
    }
}