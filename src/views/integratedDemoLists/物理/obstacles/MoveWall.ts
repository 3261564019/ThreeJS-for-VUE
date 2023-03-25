import {Color, Vector3} from "three";
import * as THREE from "three";
import {physicsBaseScene} from "../BaseScene";
import {ChildScene, MeshRigid, PhysicIns} from "../types";
import * as CANNON from "cannon-es";


/**
 *  柱子垂直旋转
 */
class MoveWall implements ChildScene {
    private ins: physicsBaseScene;
    private phyIns: PhysicIns;
    private readonly planColor: Color;
    // @ts-ignore
    private current: MeshRigid;
    private position: Vector3;
    private wallColor: Color;
    private sinShifting: number;

    constructor(position: Vector3, planColor: Color, wallColor: Color, ins: physicsBaseScene, phyIns: PhysicIns,sinShifting:number) {
        this.ins = ins;
        this.phyIns = phyIns;
        this.planColor = planColor
        this.wallColor = wallColor
        this.position = position
        this.sinShifting = sinShifting

        this.addPlan()

        this.addWall();

    }

    addWall() {
        const geometry = new THREE.BoxGeometry(20, 20, 2);
        const material = new THREE.MeshStandardMaterial({color: this.wallColor});
        const wall = new THREE.Mesh(geometry, material);
        // wall.rotation.y=Math.PI/2
        wall.castShadow = true;
        let temp = this.position;
        temp.y = 2
        wall.position.copy(temp)
        const halfExtents = new CANNON.Vec3(10, 10, 1)
        const boxShape = new CANNON.Box(halfExtents)
        const boxBody = new CANNON.Body({mass: 0, shape: boxShape});

        this.current = {mesh: wall, body: boxBody};

        this.ins.scene.add(this.current.mesh)

        this.phyIns.world.addBody(this.current.body)
    }

    addPlan() {

        const geometry = new THREE.PlaneGeometry(40, 40);
        const material = new THREE.MeshLambertMaterial({color: this.planColor});
        // material.side = THREE.DoubleSide
        const plane = new THREE.Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true;
        plane.position.copy(this.position)
        plane.rotation.x = -0.5 * Math.PI;

        //添加地板容器
        this.ins.scene.add(plane);
    }

    render(delta: number, elapsedTime: number) {

        this.current.mesh.position.x = Math.sin(elapsedTime+this.sinShifting) * 10

        // @ts-ignore
        this.current.body.position.copy(this.current.mesh.position);
        // @ts-ignore
        this.current.body.quaternion.copy(this.current.mesh.quaternion)

    }
}

export {MoveWall}

