import {ExtendedObject3D, PhysicsLoader, Project, Scene3D} from 'enable3d'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import my from "@/assets/model/111.gltf?url"
import Stats from 'stats-js';
import {Raycaster, Vector3} from "three";
import * as dat from 'dat.gui'
class MainScene extends Scene3D {
    private stats: any;
    private gui: dat.GUI;
    // @ts-ignore
    private base;

    constructor() {
        super({ key: 'MainScene' })
        this.gui=new dat.GUI({width:300});
    }
    async init() {
        this.renderer.setPixelRatio(1)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.stats = new Stats(this.renderer);
        document.body.appendChild(this.stats.dom);
    }

    async preload() {
        // preload your assets here
    }

    async create() {
        // 初始化场景，显示天空盒和orbitControls
        this.base= await this.warpSpeed()
        // 随机掉落物体
        //对刚体施加力
        // this.shpare=this.add.box({y: 10, width: 6, height: 6}, {lambert: {color: 'hotpink'}});

        // you can later add physics to it
        // this.physics.add.existing(this.shpare, { mass: 10, collisionFlags: 0 })
        // this.scene.add(this.shpare)
        // position camera
        // this.camera.position.set(10, 10, 20)


        // blue box (without physics)
        // this.add.box({ y: 2 }, { lambert: { color: 'deepskyblue' } })

        // pink box (with physics)

        this.loadGltf()
        //
        this.haveSomeFun()

        this.initCanon(this.physics, this.camera)
        //
        // this.test()

        this.addHouse()

        this.initDebug()

        window.toDie=this.toDie.bind(this)
        // this.box=this.physics.add.box({ y: 14 }, { lambert: { color: '#1d9be8' } })
    }
    public toDie(){
        this.gui.destroy()
        this.stats.domElement.parentNode.removeChild(this.stats.domElement);
        this.renderer.forceContextLoss();
        this.renderer.dispose();
        this.scene.clear();
        let dom=document.body.querySelector("canvas")
        dom?.remove()
    }
    initDebug(){
        let temp={
            temp:()=>{
                console.log("aaa",this.base)
                console.log("this",this)
                this.toDie()
            },
            debug:false
        }
        this.gui.add(temp,'debug').name("开启调试").onChange(
            e=>{
                if(e){
                    this.physics.debug.enable()
                }else{
                    this.physics.debug.disable()
                }
            }
        )
        this.gui.add(temp,"temp").name("场景销毁");
    }
    addHouse(){
        // extract the object factory from physics
        // the factory will make/add object without physics
        const config = {
            depth: 0.4,
            breakable: true,
            fractureImpulse: 5,
            collisionFlags: 3
        }

        let physics=this.physics
        // front
        physics.add.box({ y: 3, x: 2, z: 4, width: 4, height: 2, ...config })
        physics.add.box({ y: 1, x: 2, z: 4, width: 4, height: 2, ...config })
        physics.add.box({ y: 1, x: -2, z: 4, width: 4, height: 2, ...config })
        physics.add.box({ y: 3, x: -2, z: 4, width: 4, height: 2, ...config })

        // back
        physics.add.box({ y: 1, x: -2, z: 0, width: 4, height: 2, ...config })
        physics.add.box({ y: 3, x: -2, z: 0, width: 4, height: 2, ...config })
        physics.add.box({ y: 1, x: 2, z: 0, width: 4, height: 2, ...config })
        physics.add.box({ y: 3, x: 2, z: 0, width: 4, height: 2, ...config })

        // left and right
        physics.add.box({ ...config, y: 2, x: -4, z: 2, depth: 4, height: 4, width: 1 })
        physics.add.box({ ...config, y: 2, x: 4, z: 2, depth: 4, height: 4, width: 1 })

        // roof
        let r1 = this.physics.factory.add.box({ y: 4.75, x: 0, z: 0.5, width: 8, height: 4, ...config })
        let r2 =  this.physics.factory.add.box({ y: 4.75, x: 0, z: 3.5, width: 8, height: 4, ...config })
        r1.rotateX(Math.PI / 4)
        r2.rotateX(-Math.PI / 4)
        physics.add.existing(r1, { collisionFlags: 3, breakable: true })
        physics.add.existing(r2, { collisionFlags: 3, breakable: true })
    }
    initCanon(){
        const raycaster = new Raycaster()
        const force = 30
        let physics=this.physics
        let camera=this.camera


        window.addEventListener('pointerdown', event => {
            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components
            const x = (event.clientX / window.innerWidth) * 2 - 1
            const y = -(event.clientY / window.innerHeight) * 2 + 1
            raycaster.setFromCamera({ x, y }, camera)

            const pos = new Vector3()

            pos.copy(raycaster.ray.direction)
            pos.add(raycaster.ray.origin)

            const sphere = physics.add.sphere(
                {
                    radius: 0.15,
                    x: pos.x,
                    y: pos.y,
                    z: pos.z,
                    mass: 40,
                    bufferGeometry: true
                },
                { phong: { color: 0x202020 } }
            )
            sphere.body.setBounciness(0.2)

            pos.copy(raycaster.ray.direction)
            pos.multiplyScalar(24)

            let s=50
            sphere.body.applyForce(pos.x*s,pos.y*s, pos.z*s)
        })
    }
    loadGltf(){
        let loader =new GLTFLoader()
        loader.load(my,(e)=>{
            console.log("加载结果",e)
            let s=e.scene
            s.position.set(0,2,0)
            // 抽象为一个简易的物理盒子
            this.physics.add.existing(s,{shape:"hull",breakable: false})
            this.scene.add(s)
        })
    }
    test(){
        // (the center of mass is the center of the box)
        let box = this.add.box({ x: 0, y: 2 })
        const compound = [
            { shape: 'box', width: 0.5, height: 1, depth: 0.4, y: -0.5, z: 0.5 },
            { shape: 'box', width: 2.4, height: 0.6, depth: 0.4, z: -0.4, y: 0.2 },
            { shape: 'sphere', radius: 0.65, z: -0.25, y: 0.35 },
            { shape: 'box', width: 1.5, height: 0.8, depth: 1, y: 0.2, z: 0.2 }
        ]
        this.physics.add.existing(box,{compound})

// compound shape (group based)
// (the center of mass is 0,0,0)
//         let group = new Group()
//         const body = this.add.box({ height: 0.8, y: 1, width: 0.4, depth: 0.4 }, { lambert: { color: 0xffff00 } })
//         const head = this.add.sphere({ radius: 0.25, y: 1.7, z: 0.05 }, { lambert: { color: 0xffff00 } })
//         group.add(body, head)
//         group.position.setX(3)
//         this.add.existing(group)
//         this.physics.add.existing(group,{mass:2})
    }
    update() {
        // console.log("更新",this.shpare)
        // if(this.shpare){
        //     this.shpare.rotation.y=this.clock.elapsedTime
        // }
        this.stats.update()
    }
}

export default MainScene