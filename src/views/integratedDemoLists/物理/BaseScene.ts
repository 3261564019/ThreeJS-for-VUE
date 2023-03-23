import * as THREE from "three";
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import * as CANNON from "cannon-es";
import {MeshRigid, PhysicIns, usePhysics} from "./usePhysics";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import belfast_sunset_pure_sky_4k from "@/assets/hdr/belfast_sunset_puresky_4k.hdr?url";
import {LoadingManager} from "three";


export class physicsBaseScene extends BaseInit {
    //物理模块
    private readonly physicsIns:PhysicIns;
    // @ts-ignore
    public loadManager:LoadingManager;


    // @ts-ignore
    private temp:MeshRigid;

    constructor() {
        super({
            needLight: false,
            renderDomId: "#physicsBaseScene",
            needOrbitControls: true,
            needAxesHelper: true
        } as BaseInitParams);


        this.initDebug();


        this.addPlan();

        this.addLight();

        this.physicsIns= usePhysics(this);
        this.physicsIns.init({debug:true});



        this.initResourceMange()

        // this.loadSceneBg();


        const geometry = new THREE.BoxGeometry( 40, 2, 2 );
        const material = new THREE.MeshPhongMaterial( {color: "#049ef4"} );
        const cube = new THREE.Mesh( geometry, material );
        // cube.rotation.y=Math.PI/2
        cube.position.set(0,0,0)
        const halfExtents = new CANNON.Vec3(20, 1, 1)
        const boxShape = new CANNON.Box(halfExtents)
        const boxBody = new CANNON.Body({ mass: 0, shape: boxShape });
        boxBody.position.set(0,10,0)

            this.temp={mesh:cube,body:boxBody};

            this.scene.add(this.temp.mesh)

            this.physicsIns.world.addBody(this.temp.body)



    }
    initResourceMange() {
        // let that=this;
        this.loadManager = new LoadingManager(
            () => {
                console.log('加载完成', this);
                // this.finishedCallBack();
                // this.startAnimation();
                this.startRender();
            },
            // Progress
            (p) => {
                console.log("加载中",p)
            });
    }
    loadSceneBg() {
        new RGBELoader(this.loadManager).load(belfast_sunset_pure_sky_4k, (texture) => {
            console.log("纹理对象", texture);

            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.encoding = THREE.sRGBEncoding;
            this.scene.environment = texture;
            this.scene.background = texture;
            this.manualRender()
        });
    }
    addPlan() {

        const geometry = new THREE.PlaneGeometry(40, 40);
        const material = new THREE.MeshLambertMaterial({color: 0x222222});
        // material.side = THREE.DoubleSide
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

        const light = new THREE.DirectionalLight( 0xaabbff, 1 );
        light.position.x = 0;
        light.position.y = 150;
        light.position.z = - 50;
        this.scene.add(light);
    }

    startRender() {

        this.renderer.shadowMap.enabled = true;

        const clock = new THREE.Clock();

        const animate = () => {

            this.stats.update()

            // this.raf = requestAnimationFrame(animate);
            this.renderer?.render(this.scene, this.camera);
            this.physicsIns?.render(clock.getDelta());

            if(this.temp){

                this.temp.mesh.rotation.y=clock.getElapsedTime()
                // this.temp.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), clock.getElapsedTime());

                // @ts-ignore
                this.temp.body.position.copy(this.temp.mesh.position);
                // @ts-ignore
                this.temp.body.quaternion.copy(this.temp.mesh.quaternion)

            }
        }

        // animate();

        setInterval(animate,1000/60)
    }
}