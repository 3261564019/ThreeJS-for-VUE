import {Color, Vector3} from "three";
import * as THREE from "three";
import {physicsBaseScene} from "../BaseScene";
import {ChildScene, MeshRigid, PhysicIns} from "../types";
import * as CANNON from "cannon-es";
import {Water} from "three/examples/jsm/objects/Water2";


/**
 *  柱子垂直旋转
 */
class WaterPool implements ChildScene {
    private ins: physicsBaseScene;
    private phyIns: PhysicIns;
    // @ts-ignore
    private current: MeshRigid={};
    private position: Vector3;
    private sinShifting: number;

    constructor(position: Vector3, ins: physicsBaseScene, phyIns: PhysicIns,sinShifting:number) {
        this.ins = ins;
        this.phyIns = phyIns;
        this.position = position
        this.sinShifting = sinShifting

        this.addPlan()

        this.addWall();

    }

    addWall() {

    }

    addPlan() {

        const geometry = new THREE.BoxGeometry(40, 40, 0);

        let water = new Water( geometry, {
            color:"#ffffff",
            scale:4,
            flowDirection: new THREE.Vector2( 1,1 ),
            textureWidth: 1024,
            textureHeight: 1024
        } );

        water.rotation.x = Math.PI * - 0.5;
        // @ts-ignore
        water.position.set(...this.position)
        this.current.mesh=water;



        this.ins.scene.add( water );
        this.ins.scene.add(this.current.mesh)
        // this.phyIns.world.addBody(this.current.body)
    }

    render(delta: number, elapsedTime: number) {

        // this.current.mesh.position.x = Math.sin(elapsedTime+this.sinShifting) * 10

        // @ts-ignore
        // this.current.body.position.copy(this.current.mesh.position);
        // @ts-ignore
        // this.current.body.quaternion.copy(this.current.mesh.quaternion)

    }
}

export {WaterPool}

