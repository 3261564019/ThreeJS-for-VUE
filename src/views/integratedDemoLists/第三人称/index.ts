import {Project, Scene3D, PhysicsLoader, ExtendedObject3D, ThirdPersonControls} from 'enable3d'
import boxMan from "@/assets/model/box_man.glb?url"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import my from "*?url";
import {Group, Vector3} from "three";
class MainScene extends Scene3D {

    man:ExtendedObject3D;
    private controls: any;
    private keys: { a: any; s: any; d: any; w: any; space: any };

    async init() {
        this.renderer.setPixelRatio(1)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
    constructor() {
        super({ key: 'thirdPerson' });
    }

    async preload() {
        // preload your assets here
    }

    async create() {
        // set up scene (light, ground, grid, sky, orbitControls)
        this.warpSpeed('-orbitControls')

        this.physics.debug.enable()

        // enable physics debug
        // this.physics.debug.enable()

        this.loadGltf()
        // position camera
        // this.camera.position.set(10, 10, 20)

        // blue box (without physics)
        // this.add.box({ y: 2 }, { lambert: { color: 'deepskyblue' } })

        // pink box (with physics)
        // this.physics.add.box({ y: 10 }, { lambert: { color: 'hotpink' } })

        // this.box=this.physics.add.box({ y: 14 }, { lambert: { color: '#1d9be8' } })
    }
    loadGltf(){
        let loader =new GLTFLoader()
        loader.load(boxMan,(e)=>{
            console.log("加载结果",e)
            let res=e.scene

            this.man = new ExtendedObject3D()
            this.man.add(res)
            this.man.name = 'man'
            this.man.rotateY(Math.PI + 0.1) // a hack

            //产生阴影
            this.man.traverse(child => {
                if (child.isMesh) {
                    child.shape = 'convex'
                    child.castShadow = child.receiveShadow = true
                    // https://discourse.threejs.org/t/cant-export-material-from-blender-gltf/12258
                    child.material.roughness = 1
                    child.material.metalness = 0
                }
            })

            /**
             * 处理模型自带动画
             */
            this.animationMixers.add(this.man.anims.mixer)
            e.animations.forEach(animation => {
                if (animation.name) {
                    // 将动画添加到anims中
                    this.man.anims.add(animation.name, animation)
                }
            })
            //直接开始播放任务休息的动画
            this.man.anims.play('idle')

            /**
             * 给人物添加刚体
             */
            this.add.existing(this.man)
            this.physics.add.existing(this.man, {
                shape: 'capsule',
                radius: 0.2,
                height: 0.6,
                offset: { y: -0.55 }
            })
            this.man.body.setFriction(0.8)
            this.man.body.setAngularFactor(0, 0, 0)

            /**
             * 添加第三人称控制器
             */
            this.controls = new ThirdPersonControls(this.camera, this.man, {
                offset: new Vector3(0, 1, 0),
                targetRadius: 3
            })
            //添加键盘映射
            this.keys = {
                a: this.input.keyboard.addKey('a'),
                w: this.input.keyboard.addKey('w'),
                d: this.input.keyboard.addKey('d'),
                s: this.input.keyboard.addKey('s'),
                space: this.input.keyboard.addKey(32)
            }

            // 抽象为一个简易的物理盒子
            // this.physics.add.existing(s,{shape:"hull",breakable: false})
            this.scene.add(this.man)
        })
    }
    update() {
        // if(this.box){
        //
        //     this.box.rotation.x += 0.01
        //     this.box.rotation.y += 0.01
        // }
    }
}



export {MainScene}