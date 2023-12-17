import {
    Scene3D,
    ExtendedObject3D,
    JoyStick,
    PointerLock,
    PointerDrag
}  from "enable3d";
import {ThirdPersonControls} from "./thirdPersonControls.js";
import boxMax from "@/assets/model/box_man.glb?url"
import bookModel from "@/assets/model/book.glb?url"
import {Vector3} from "three";
import * as dat from 'dat.gui';
import Stats from 'stats-js';

/**
 * Is touch device?
 */
const isTouchDevice = 'ontouchstart' in window

class MainScene extends Scene3D {

    debugParams={
        //调试物理世界
        debugPhysics:false
    }
    // movement 鼠标向右移动该值为正，向左为负
    moveRight=0
    // 经过取反后 鼠标向上移动为正，向下为负值
    moveTop

    constructor() {
        super({key:'MainScene'})
        this.initStats()
        this.initDebug()
    }
    initStats() {
        //实例化
        let stats = new Stats();
        //setMode参数如果是0，监测的是FPS信息，如果是1，监测的是渲染时间
        stats.setMode(0);
        //把统计面板放到左上角
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.left = '0px';
        //添加到body里
        document.body.appendChild(stats.domElement);
        this.stats = stats;
    }
    initDebug() {
        this.dat = new dat.GUI({width: 400});
    }
    init() {
        this.renderer.setPixelRatio(Math.max(1, window.devicePixelRatio / 2))

        this.canJump = true
        this.move = false

        this.moveTop = 0
        this.moveRight = 0
    }

    async preload() {
        /**
         * Medieval Fantasy Book by Pixel (https://sketchfab.com/stefan.lengyel1)
         * https://sketchfab.com/3d-models/medieval-fantasy-book-06d5a80a04fc4c5ab552759e9a97d91a
         * Attribution 4.0 International (CC BY 4.0)
         */
        const book = this.load.preload('book', bookModel)

        /**
         * box_man.glb by Jan Bláha
         * https://github.com/swift502/Sketchbook
         * CC-0 license 2018
         */
        const man = this.load.preload('man', boxMax)

        await Promise.all([book, man])
    }

    async create() {
        const { lights } = await this.warpSpeed('-ground', '-orbitControls')

        const { hemisphereLight, ambientLight, directionalLight } = lights
        const intensity = 1
        hemisphereLight.intensity = intensity
        ambientLight.intensity = intensity
        directionalLight.intensity = intensity

        this.dat.add(this.debugParams,"debugPhysics").name('是否调试物理').onChange((value)=>{
            if (value) {
                this.physics.debug.enable()
            } else {
                this.physics.debug.disable()
            }
        });

        const addBook = async () => {
            const object = await this.load.gltf('book')
            const scene = object.scenes[0]

            const book = new ExtendedObject3D()
            book.name = 'scene'
            book.add(scene)
            this.add.existing(book)

            // add animations
            // sadly only the flags animations works
            object.animations.forEach((anim, i) => {
                book.mixer = this.animationMixers.create(book)
                // overwrite the action to be an array of actions
                book.action = []
                book.action[i] = book.mixer.clipAction(anim)
                book.action[i].play()
            })

            book.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = child.receiveShadow = false
                    child.material.metalness = 0
                    child.material.roughness = 1

                    if (/mesh/i.test(child.name)) {

                        console.log("child",child)

                        this.physics.add.existing(child, {
                            shape: 'concave',
                            mass: 0,
                            collisionFlags: 1,
                            autoCenter: false
                        })
                        /**
                         * setAngularFactor（设置角速度因子）是一种用于控制刚体旋转的方法。它通常用于调整刚体在受力或碰撞时的旋转行为。
                         * 如果您将角速度因子设置为(0, 1, 0)，则表示刚体只能绕Y轴旋转，而在X轴和Z轴上将被禁止旋转。这样可以实现类似于锁定某个轴的效果。
                         */
                        child.body.setAngularFactor(0, 0, 0)
                        /**
                         * 类似于setAngularFactor方法，但是控制的是刚体在每个轴上的线速度。
                         * 如果您将线速度因子设置为(0, 1, 0)，则表示刚体只能沿着Y轴方向移动，而在X轴和Z轴方向上将被禁止移动。这样可以实现类似于锁定某个轴的效果。
                         */
                        child.body.setLinearFactor(0, 0, 0)
                    }
                }
            })
        }
        const addMan = async () => {
            const object = await this.load.gltf('man')
            const man = object.scene.children[0]

            this.man = new ExtendedObject3D()
            this.man.name = 'man'
            this.man.rotateY(Math.PI + 0.1) // a hack
            this.man.add(man)
            this.man.rotation.set(0, Math.PI * 1.5, 0)
            this.man.position.set(35, 0, 0)
            // add shadow
            this.man.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = child.receiveShadow = false
                    // https://discourse.threejs.org/t/cant-export-material-from-blender-gltf/12258
                    child.material.roughness = 1
                    child.material.metalness = 0
                }
            })

            /**
             * Animations
             */
            // ad the box man's animation mixer to the animationMixers array (for auto updates)
            this.animationMixers.add(this.man.animation.mixer)

            object.animations.forEach(animation => {
                if (animation.name) {
                    this.man.animation.add(animation.name, animation)
                }
            })
            this.man.animation.play('idle')

            /**
             * Add the player to the scene with a body
             */
            this.add.existing(this.man)
            this.physics.add.existing(this.man, {
                shape: 'sphere',
                radius: 0.25,
                width: 0.5,
                offset: { y: -0.25 }
            })
            // 设置刚体摩擦力度
            this.man.body.setFriction(0.8)
            // 使刚体无法因为碰撞而旋转
            this.man.body.setAngularFactor(0, 0, 0)
            // Ccd设置，防止速度过快，跳过检测
            // https://docs.panda3d.org/1.10/python/programming/physics/bullet/ccd
            // this.man.body.setCcdMotionThreshold(1e-7)
            // this.man.body.setCcdSweptSphereRadius(0.25)

            /**
             * Add 3rd Person Controls
             */
            this.controls = new ThirdPersonControls(this.camera, this.man, {
                offset: new Vector3(0, 1, 0),
                //相机距离任务的距离
                targetRadius: 3
            })
            // set initial view to 90 deg theta
            this.controls.theta = 90

            /**
             * Add Pointer Lock and Pointer Drag
             */
            if (!isTouchDevice) {
                let pl = new PointerLock(this.canvas)
                let pd = new PointerDrag(this.canvas)
                pd.onMove(delta => {
                    if (pl.isLocked()) {
                        console.log(delta)

                        this.moveTop = -delta.y
                        this.moveRight = delta.x
                    }
                })
            }
        }

        addBook()
        addMan()

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

        const press = (e, isDown) => {
            e.preventDefault()
            const { keyCode } = e
            switch (keyCode) {
                case 87: // w
                    this.keys.w.isDown = isDown
                    break
                case 38: // arrow up
                    this.keys.w.isDown = isDown
                    break
                case 32: // space
                    this.keys.space.isDown = isDown
                    break
            }
        }

        document.addEventListener('keydown', e => press(e, true))
        document.addEventListener('keyup', e => press(e, false))

        /**
         * Add joystick
         */
        if (isTouchDevice) {
            const joystick = new JoyStick()
            const axis = joystick.add.axis({
                styles: { left: 20, bottom: 175, size: 100 }
            })
            axis.onMove(event => {
                /**
                 * Update Camera
                 */
                const { top, right } = event
                this.moveTop = top * 3
                this.moveRight = right * 3
            })
            const buttonA = joystick.add.button({
                letter: 'A',
                styles: { right: 20, bottom: 250, size: 80 }
            })
            buttonA.onClick(() => this.jump())
            const buttonB = joystick.add.button({
                letter: 'B',
                styles: { right: 95, bottom: 175, size: 80 }
            })
            buttonB.onClick(() => (this.move = true))
            buttonB.onRelease(() => (this.move = false))
        }

        setTimeout(() => {
            const placeholder = document.getElementById('welcome-game-placeholder')
            if (placeholder) placeholder.remove()
        }, 500)
    }

    jump() {
        if (!this.man || !this.canJump) return
        this.canJump = false
        this.man.animation.play('jump_running', 500, false)
        setTimeout(() => {
            this.canJump = true
            this.man.animation.play('idle', 500)
        }, 500)
        this.man.body.applyForceY(6)
    }

    update(time, delta) {
        this.stats?.begin()
        if (this.man && this.man.body) {
            /**
             * Update Controls
             */
            this.controls.update(this.moveRight * 3, -this.moveTop * 3)
            if (!isTouchDevice) this.moveRight = this.moveTop = 0
            /**
             * Player Turn
             */
            const speed = 4
            const v3 = new Vector3()

            const rotation = this.camera.getWorldDirection(v3)
            const theta = Math.atan2(rotation.x, rotation.z)
            const rotationMan = this.man.getWorldDirection(v3)
            const thetaMan = Math.atan2(rotationMan.x, rotationMan.z)
            this.man.body.setAngularVelocityY(0)

            const l = Math.abs(theta - thetaMan)
            let rotationSpeed = isTouchDevice ? 2 : 4
            let d = Math.PI / 24

            if (l > d) {
                if (l > Math.PI - d) rotationSpeed *= -1
                if (theta < thetaMan) rotationSpeed *= -1
                this.man.body.setAngularVelocityY(rotationSpeed)
            }

            /**
             * Player Move
             */
            if (this.keys.w.isDown || this.move) {
                if (this.man.animation.current === 'idle' && this.canJump) this.man.animation.play('run')

                const x = Math.sin(theta) * speed,
                    y = this.man.body.velocity.y,
                    z = Math.cos(theta) * speed

                this.man.body.setVelocity(x, y, z)
            } else {
                if (this.man.animation.current === 'run' && this.canJump) this.man.animation.play('idle')
            }

            /**
             * Player Jump
             */
            if (this.keys.space.isDown && this.canJump) {
                this.jump()
            }
        }
        this.stats?.end()
    }
}
export {MainScene}