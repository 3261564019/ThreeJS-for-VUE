import * as CANNON from "cannon-es";
import {BoxGeometry, Mesh, MeshBasicMaterial, MeshNormalMaterial, SphereGeometry} from "three";
// @ts-ignore


export interface MeshRigid{
    mesh:Mesh,
    body:CANNON.Body
}
// @ts-ignore
export function usePhysics(ins){

    let context=ins;
    let mrMap:Array<MeshRigid>=[];
    const world =  new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
    });

    let current:MeshRigid;



    function init() {
        initPlan()
        
        temp()

        addBall()
    }


    function sphereMove({keyCode}) {
        console.log("event.keyCode",keyCode);
        let unit=12;
        switch (keyCode) {
            //w
            case 83:
                current.body.velocity.set(0,0,unit);
                break;
                //a
            case 65:
                current.body.velocity.set(-unit,0,0);
                break;
                //s
            case 87:
                current.body.velocity.set(0,0,-unit);
                break;
                //d
            case 68:
                current.body.velocity.set(unit,0,0);
                break;
            case 32:
                current.body.velocity.set(0,unit,0);
                break;

        }
    }

    function addBall() {

        const radius = 2
        const sphereShape = new CANNON.Sphere(radius)
        const sphereBody = new CANNON.Body({ mass: 5, shape: sphereShape })
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

        window.onkeydown = sphereMove
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


    return {
        world,
        mrMap,
        init
    }

}