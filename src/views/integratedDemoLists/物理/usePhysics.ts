import * as CANNON from "cannon-es";
import {BoxGeometry, Mesh, MeshNormalMaterial, SphereGeometry} from "three";
import {throttle} from "../../../utils";
import CannonDebugger from "cannon-es-debugger";
import {physicsBaseScene} from "./BaseScene";
// @ts-ignore


export interface MeshRigid{
    mesh:Mesh,
    body:CANNON.Body
}

export interface PhysicIns{
    world:CANNON.World,
    mrMap:Array<MeshRigid>,
    init(params:PhysicInsParams):void,
    render:Function
}

export interface PhysicInsParams{
    debug?:Boolean
}

// @ts-ignore
export function usePhysics(ins:physicsBaseScene){

    let mrMap:Array<MeshRigid>=[];
    const world =  new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
    });

    let current:MeshRigid;
    //是否显示物理世界的线条
    let showRigidDebugLine:Boolean=true
    // @ts-ignore
    let cannonDebuggerIns:CannonDebugger=null
    let params:PhysicInsParams={}




    function init(p:PhysicInsParams) {

        if(p){
            params=p;

            if(p.debug){
                // @ts-ignore
                cannonDebuggerIns= new CannonDebugger(ins.scene,world)
            }
        }

        initPlan()
        
        temp()

        addBall()
    }


    function sphereMove({code}:KeyboardEvent) {
        console.log("event.keyCode",code);
        let unit=12;
        switch (code) {
            //w
            case "KeyS":
                current.body.velocity.set(0,0,unit);
                break;
                //a
            case "KeyA":
                current.body.velocity.set(-unit,0,0);
                break;
                //s
            case "KeyW":
                current.body.velocity.set(0,0,-unit);
                break;
                //d
            case "KeyD":
                current.body.velocity.set(unit,0,0);
                break;
            case "Space":
                current.body.velocity.set(0,unit,0);
                break;

        }
    }

    function addBall() {

        const radius = 2
        const sphereShape = new CANNON.Sphere(radius)
        const sphereBody = new CANNON.Body({ mass: 200, shape: sphereShape })
        world.addBody(sphereBody)

        sphereBody.position.set(10,30,0)

        const geometry = new SphereGeometry( radius, 12, 16 );
        const material = new MeshNormalMaterial();
        const ball = new Mesh( geometry, material );
        ball.userData.isBall=true
        ins.scene.add(ball);

        current={
            mesh:ball,
            body:sphereBody
        }

        mrMap.push(current)
        let temp=throttle(sphereMove,100);
        console.log(temp)
        window.onkeydown =temp;
    }
    
    function temp() {

        let size = 4;
        const halfExtents = new CANNON.Vec3(size/2, size/2, size/2)
        const boxShape = new CANNON.Box(halfExtents)
        const boxBody = new CANNON.Body({ mass: 2, shape: boxShape });

        boxBody.position.set(0,30,0)

        const geometry = new BoxGeometry( size, size, size );
        const material = new MeshNormalMaterial();
        const cube = new Mesh( geometry, material );

        current={
            mesh:cube,
            body:boxBody
        }
        mrMap.push(current)

        let debugParams = {
            addBox: () => {

                let size = Math.random() * 8;
                const halfExtents = new CANNON.Vec3(size/2, size/2, size/2)
                const boxShape = new CANNON.Box(halfExtents)
                const boxBody = new CANNON.Body({ mass: 2, shape: boxShape });

                boxBody.position.set(0,20,0)

                const geometry = new BoxGeometry( size, size, size );
                const material = new MeshNormalMaterial();
                const cube = new Mesh( geometry, material );

                mrMap.push({
                    mesh:cube,
                    body:boxBody
                })

                ins.scene.add(cube);
                world.addBody(boxBody);
            },
            move:()=>{

                // boxBody.fixedRotation=true
                boxBody.velocity.set(10,0,0);

            }
        }





        ins.scene.add(cube);
        world.addBody(boxBody);

        ins.dat.add(debugParams,"addBox").name("随机添加正方体");
        ins.dat.add(debugParams,"move").name("移动");

    }


    function initPlan() {
        const planeShape=new CANNON.Plane();
        const planeBody = new CANNON.Body({ mass: 0, shape:  planeShape })
        planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI * 0.5);
        world.addBody(planeBody)
    }


    function render(delta:number) {
        world.step(delta);
        for (let i = 0; i <mrMap.length; i++) {
            let {mesh, body} = mrMap[i];
            // @ts-ignore
            mesh.position.copy(body.position)
            // @ts-ignore
            mesh.quaternion.copy(body.quaternion)

            if (mesh.userData.isBall) {
                ins.camera.position.x = body.position.x
                ins.camera.position.y = body.position.y + 30
                ins.camera.position.z = body.position.z + 40
                // console.log("位置",body.position)
                // @ts-ignore
                ins.camera.lookAt(body.position.x, body.position.y, body.position.z)

            }
        }

        if(params.debug){
            cannonDebuggerIns.update();
        }
    }


    return {
        world,
        mrMap,
        init,
        render
    }

}