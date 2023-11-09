import { Project, Scene3D, PhysicsLoader } from 'enable3d'

class MainScene extends Scene3D {
    async init() {
        this.renderer.setPixelRatio(1)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    async preload() {
        // preload your assets here
    }

    async create() {
        // set up scene (light, ground, grid, sky, orbitControls)
        this.warpSpeed()

        // enable physics debug
        // this.physics.debug.enable()

        // position camera
        // this.camera.position.set(10, 10, 20)

        // blue box (without physics)
        // this.add.box({ y: 2 }, { lambert: { color: 'deepskyblue' } })

        // pink box (with physics)
        // this.physics.add.box({ y: 10 }, { lambert: { color: 'hotpink' } })

        // this.box=this.physics.add.box({ y: 14 }, { lambert: { color: '#1d9be8' } })
    }

    update() {
        // if(this.box){
        //
        //     this.box.rotation.x += 0.01
        //     this.box.rotation.y += 0.01
        // }
    }
}

// set your project configs
const config = { scenes: [MainScene] }

// load the ammo.js file from the /lib folder and start the project
PhysicsLoader('/lib', () => new Project(config))