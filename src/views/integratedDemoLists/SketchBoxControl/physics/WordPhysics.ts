import * as CANNON from "cannon-es";
import CannonDebugger from 'cannon-es-debugger'
import {SketchBoxScene} from "../SketchBoxScene";
import {Updatable} from "../type";
export class WordPhysics implements Updatable{
    world:CANNON.World
    //主类的引用
    ins:SketchBoxScene
    debug:any
    constructor(ins:SketchBoxScene) {
        this.ins=ins
        let world=new CANNON.World();
        world.gravity.set(0, -9.820, 0);
        world.broadphase = new CANNON.SAPBroadphase(world);
        world.allowSleep = true;

        /**
         * GSSolver（Gauss-Seidel Solver）是一种用于解决刚体间接触约束的求解器。它主要用于处理物体之间的碰撞和接触问题。
         */
        const solver = new CANNON.GSSolver();
        solver.iterations=10
        world.solver=solver

        this.world=world
        this.addGround()
        //添加物理的调试工具
        this.initDebug()
    }
    initDebug(){
        // @ts-ignore
        this.debug= new CannonDebugger(this.ins.scene, this.world)
    }
    addGround(){
        const floorSize = new CANNON.Vec3(140, 10, 140); // 指定平面的大小

        const floorShape = new CANNON.Box(new CANNON.Vec3(
            floorSize.x * 0.5,
            floorSize.y * 0.5,
            floorSize.z * 0.5
        ));

        const floorBody = new CANNON.Body({ shape: floorShape });
        floorBody.position.set(0,-5,0)
        // floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI * 0.5);

        this.world.addBody(floorBody);
    }
    render(delta:number,elapsedTime:number){
        try {
            this.debug.update()
            this.world.step(delta)
        }catch (e) {
            // @ts-ignore
            console.log("物理渲染报错",e.message)
        }
    }

    destroy() {
        this.debug=null
        // 释放所有刚体和约束的资源
        this.world.bodies.forEach(body => this.world.removeBody(body));
        this.world.constraints.forEach(constraint => this.world.removeConstraint(constraint));
        // 清除引用
        this.world.bodies.length = 0;
        this.world.constraints.length = 0;
        // @ts-ignore
        this.world = null;
    }
}