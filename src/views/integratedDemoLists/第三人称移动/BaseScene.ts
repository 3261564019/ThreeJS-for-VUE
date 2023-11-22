import * as THREE from "three";
import {AnimationClip, AnimationMixer, Clock, Color, Group, Vector3} from "three";
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import boxMan from "@/assets/model/box_man.glb?url";

export class BaseScene extends BaseInit {
    animationMixer:AnimationMixer
    clock:Clock;
    debugData:{
        reSetCameraPosition: () => void;
        calcPosition: () => void;
        actionName:string};
    animationMap:Map<string,AnimationClip>;
    boxMan:Group
    cameraTargetPosition:Vector3 | null
    constructor() {
        super({
            needLight:false,
            renderDomId:"#renderDom",
            needOrbitControls:false,
            adjustScreenSize:true,
            needAxesHelper:true
        } as BaseInitParams);

        this.clock=new Clock();

        this.debugData={
            //当前执行的动作名称
            actionName:"",
            //计算相机位置的回调
        }

        this.initDebug();

        this.init();

        this.loadModel()

        this.addPlan();

        this.addLight();

        this.addBall();

        this.animate();

        this.addCalcCameraPositionDebug();
    }
    addCalcCameraPositionDebug(){
        this.debugData.calcPosition=()=>{
            const character = this.boxMan
            const camera = this.camera;

            console.log("sss",character)
            // 计算相机的位置
            const distance = 20; // 相机与人物的距离
            const characterDirection = character.rotation.y; // 获取人物的朝向角度
             // 计算相机的位置
            // 将相机设置在人物后面并旋转180度
            // camera.position.copy(cameraPosition);
            // camera.rotation.y = characterDirection + Math.PI;

            this.cameraTargetPosition=new THREE.Vector3(
                character.position.x - Math.sin(characterDirection) * distance,
                character.position.y + 15, // 相机的高度
                character.position.z - Math.cos(characterDirection) * distance
            )

            // 将相机的目标点设置为人物模型的中心点
           let temp= new THREE.Vector3(
                character.position.x,
                character.position.y + 1.5, // 人物模型的中心点高度
                character.position.z
            );
            camera.lookAt(temp);
        }
        this.debugData.reSetCameraPosition=()=>{
            this.camera.position.set(20,20,20)
        }
        this.dat.add(this.debugData,"calcPosition").name("计算相机位置");
        this.dat.add(this.debugData,"reSetCameraPosition").name("重置相机位置");
    }
    addPlan(){

        const geometry = new THREE.PlaneGeometry(40, 40);
        const material = new THREE.MeshLambertMaterial({color: 0xcccccc});

        const plane = new THREE.Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        //添加地板容器
        this.scene.add(plane);

    }
    loadModel(){
        let loader =new GLTFLoader()
        this.animationMap=new Map();
        loader.load(boxMan,(e)=> {
            console.log("加载结果", e)
            let res = e.scene
            res.name="boxMan"
            res.scale.set(5,5,5)
            res.traverse(child => {
                if (child.isMesh) {
                    child.shape = 'convex'
                    child.castShadow = child.receiveShadow = true
                    // https://discourse.threejs.org/t/cant-export-material-from-blender-gltf/12258
                    child.material.roughness = 1
                    child.material.metalness = 0
                    child.material.color = new Color("#fff")
                }
            })
            let temp={}
            //将动画存到map中，动画名作为key方便调用
            e.animations.forEach(v=>{
                // @ts-ignore
                temp[v.name]=v.name
                this.animationMap.set(v.name,v)
            })


            this.animationMixer = new AnimationMixer(res);
            this.scene.add(res)

            const action = this.animationMixer.clipAction(e.animations[0]);
            action.play();


            this.dat.add(this.debugData,"actionName",temp).onFinishChange(
                e=>{
                    this.animationMixer.stopAllAction(); // 停止所有正在播放的动画
                    const action = this.animationMixer.clipAction(this.animationMap.get(e) as AnimationClip);

                    action.setLoop(THREE.LoopOnce, 0); // 设置循环模式为只播放一次
                    action.clampWhenFinished = true; // 动画结束后保持在最后一帧
                    action.play();

                    console.log("q",e)
                }
            ).name("动画")


            this.boxMan=res
            console.log("动画列表",this.animationMap)
        })
    }
    addLight(){

        //创建聚光灯
        const light = new THREE.SpotLight("#fff");
        light.castShadow = true;            // default false
        light.position.x = 20;
        light.position.y = 30;
        this.scene.add(light);


        const alight = new THREE.AmbientLight("#fff",0.6);
        this.scene.add(alight);

    }
    addBall(){

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(3, 33, 33),
            new THREE.MeshLambertMaterial({color: "#fff"})
        );

        sphere.position.x = 10;
        sphere.position.y = 3;
        sphere.castShadow = true

        this.scene.add(sphere);
    }
    init() {

        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.9;
        this.renderer.outputEncoding = THREE.LinearEncoding;

        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 30, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

    }
    animate(){

        if(this.animationMixer){
            this.animationMixer.update(this.clock.getDelta());
        }
        if(this.boxMan){
            this.camera.lookAt(this.boxMan.position)
        }
        if(this.cameraTargetPosition){
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

        this.stats.update()
        this.raf=requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
    destroy() {
        super.destroy();
    }
}