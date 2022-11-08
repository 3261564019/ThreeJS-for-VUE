import * as THREE from "three";
import gsap from 'gsap';
import {BaseInit, BaseInitParams} from "../../three/classDefine/baseInit";
import {func} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import {Mesh} from "three";

export class AmmoDemo1 extends BaseInit {

    physicalWorld:Ammo.btDiscreteDynamicsWorld
    meshList:Mesh[]=[]
    tempTrans:Ammo.btTransform;

    constructor() {
        super({
            needLight: false,
            renderDomId: "#ammoSceneDemo",
            needOrbitControls: true,
            needScreenSize:true,
            needAxesHelper:true
        } as BaseInitParams);

        this.initDebug();

        this.init();

        // this.addPlan();

        this.addLight();

        // this.addBall();

        Ammo().then(
            res=>{
                //初始化物理世界
                this.initPhysicalWorld();
                //创建刚体
                this.creatPhysicalObject();
                this.startAnimation();
                //创建动态添加刚体的dat
                this.initAddEvent();
            }
        )

    }
    initAddEvent(){
        let debugParams = {
            addCube: () => {
                this.createCube(Math.random()*10,new THREE.Vector3(0,52,0),Math.random()*3,null);
            }
        }

        this.dat.add(debugParams, "addCube").name("添加正方体");
    }
    creatPhysicalObject(){
        //创建场景的底座
        this.createCube(40,new THREE.Vector3(0,-22,0),0,null);
        //创建物体
        this.createCube(2,new THREE.Vector3(0,22,0),2,null);
    }
    /**
     * 创建立方体
     * @param size 立方体大小
     * @param position 立方体位置
     * @param mass 立方体质量
     * @param rot_quaternion
     * */
    createCube(size,position,mass,rot_quaternion){

        if(!rot_quaternion){
            rot_quaternion={x:0,y:0,z:0,w:1};
        }

        console.log("参数",rot_quaternion);

        //创建图形部分
        let mesh=new THREE.Mesh(
            new THREE.BoxGeometry(size,size,size),
            new THREE.MeshStandardMaterial({color:Math.random()*0xffffff})
        );
        mesh.position.copy(position);
        this.scene.add(mesh);
        //创建物理部分

        let transform=new Ammo.btTransform();
        transform.setIdentity();
        //设置其位置
        transform.setOrigin(new Ammo.btVector3(...position));
        //调整姿态
        transform.setRotation(new Ammo.btQuaternion(
            rot_quaternion.x,
            rot_quaternion.y,
            rot_quaternion.z,
            rot_quaternion.w
        ));
        //默认姿态
        let defaultMotionState=new Ammo.btDefaultMotionState(transform);

        //设置碰撞几何结构
        let boxShape=new Ammo.btBoxShape(
            //几何尺寸的一半作为碰撞尺寸
            new Ammo.btVector3(size/2,size/2,size/2)
        );
        boxShape.setMargin(0.05);
        let localIntertia=new Ammo.btVector3(0,0,0);
        boxShape.calculateLocalInertia(mass,localIntertia);

        //创建刚体
        let rigidBodyInfo=new Ammo.btRigidBodyConstructionInfo(
            mass,
            defaultMotionState,
            boxShape,
            localIntertia
        );
        let rigidBody=new Ammo.btRigidBody(rigidBodyInfo);
        //将该刚体加至世界
        this.physicalWorld.addRigidBody(rigidBody);
        //创建关联物体结构
        mesh.userData.physicalBody=rigidBody;

        this.meshList.push(mesh);
    }
    initPhysicalWorld() {
        //碰撞的物理配置
        const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        const dispatcher=new Ammo.btCollisionDispatcher(collisionConfiguration);
        const overlappingPairCache=new Ammo.btDbvtBroadphase();
        const solver=new Ammo.btSequentialImpulseConstraintSolver();
        //创建世界
        this.physicalWorld=new Ammo.btDiscreteDynamicsWorld(
            dispatcher,
            overlappingPairCache,
            solver,
            collisionConfiguration
        );
        //设置世界引力
        this.physicalWorld.setGravity(new Ammo.btVector3(0,-75,0));
        this.tempTrans=new Ammo.btTransform();
    }

    addPlan() {

        const geometry = new THREE.PlaneGeometry(40, 40);
        const material = new THREE.MeshLambertMaterial({color: 0x222222});
        material.side = THREE.DoubleSide
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

    addLight() {

        //创建聚光灯
        const light = new THREE.SpotLight("#fff");
        light.castShadow = true;            // default false
        light.position.x = 20;
        light.position.y = 30;

        this.scene.add(light);
    }

    addBall() {

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

        this.renderer.shadowMap.enabled = true;

        this.camera.position.set(0, 30, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)


    }

    startAnimation() {

        const clock = new THREE.Clock();

        const animate = () => {
            let delta=clock.getDelta();

            this.stats.update()

            this.physicalWorld.stepSimulation(delta,10);
            //和图形世界同步
            this.meshList.forEach((v )=>{
                //取出该物体的刚体对象
                let body=v.userData.physicalBody as Ammo.btRigidBody;
                //该物体的姿态
                let motionState=body.getMotionState() as Ammo.btMotionState;


                if(motionState){
                    motionState.getWorldTransform(this.tempTrans);
                    let position=this.tempTrans.getOrigin();
                    let rotation=this.tempTrans.getRotation();
                    v.position.set(position.x(),position.y(),position.z());
                    v.quaternion.set(
                        rotation.x(),
                        rotation.y(),
                        rotation.z(),
                        rotation.w()
                    )

                }
            })

            requestAnimationFrame(animate);

            this.renderer.render(this.scene, this.camera);
        }

        animate();
    }
}