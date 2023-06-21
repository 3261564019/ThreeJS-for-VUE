import * as CANNON from "cannon-es";
import {BoxGeometry, Mesh, MeshNormalMaterial, SphereGeometry, Vector3} from "three";
import {throttle} from "../../../utils";
import CannonDebugger from "cannon-es-debugger";
import {physicsBaseScene} from "./BaseScene";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {MeshRigid, PhysicIns, PhysicInsParams, PhysicsMaterials} from "./types";
import {useConstraint} from "./constraint/useConstraint";


function usePhysics(ins:physicsBaseScene):PhysicIns{
    let mrMap:Array<MeshRigid>=[];
    const world =  new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
    });
    //当前第一人称所控制的物体
    let current:MeshRigid;
    // @ts-ignore
    let cannonDebuggerIns:CannonDebugger=null
    let params:PhysicInsParams={}
    let delta:number
    let preCode:String
    //常用材质
    // @ts-ignore
    let physicsMaterials:PhysicsMaterials={};

    let cameraDeviation:{ x: number; y: number; z: number }={x:0,y:15,z:50}

    function init(p:PhysicInsParams) {

        if(p){
            params=p;
            if(p.debug){
                // @ts-ignore
                cannonDebuggerIns= new CannonDebugger(ins.scene,world)
            }
        }

        intiMaterial();

        addWalls();

        initPlan();

        addTempDebug()

        addBall();

        let constraints=useConstraint(world,ins,{x:-10,y:36,z:-30});
        let constraints1=useConstraint(world,ins,{x:10,y:36,z:-30});


        console.log(constraints)
        console.log(constraints1)

        // console.log("建立的约束",constraints.mrMap)
        mrMap=mrMap.concat(constraints.mrMap);
        mrMap=mrMap.concat(constraints1.mrMap);

        // setTimeout(()=>{
        //
        //     mrMap.map((
        //         {
        //             body
        //         }
        //     )=>{
        //         console.log(body.position)
        //     })
        // },3000)
    }

    function intiMaterial() {
        physicsMaterials.planMaterial=new CANNON.Material("planMaterial");
        physicsMaterials.ballMaterial=new CANNON.Material("ballMaterial");
        physicsMaterials.wallMaterial=new CANNON.Material("wallMaterial");

        let ballPlanMatch=new CANNON.ContactMaterial(
            physicsMaterials.planMaterial,
            physicsMaterials.ballMaterial,
            {
                //摩擦力
                friction:0.1,
                //回弹力度
                restitution:0.5,
                //很小会很软，类似水的材质 90 左右会回弹
                // contactEquationStiffness:200,
            }
        )

        let ballWallMatch=new CANNON.ContactMaterial(
            physicsMaterials.wallMaterial,
            physicsMaterials.ballMaterial,
            {
                //摩擦力
                friction:80,
                frictionEquationRelaxation:3,
                //回弹力度
                restitution:0,
                //无更好的翻译 3
                contactEquationRelaxation:3,
                // 生成的接触方程的刚度。 1e7
                contactEquationStiffness:1e7,
                //很小会很软，类似水的材质 90 左右会回弹
                frictionEquationStiffness:1e7
            }
        )


        world.addContactMaterial(ballPlanMatch)
        world.addContactMaterial(ballWallMatch)
        world.defaultContactMaterial=ballPlanMatch
    }

    function addWalls() {

        let wall=[
            {
                size:[40/2,2,320/2],
                position:[0,41,-320/2]
            },
            {
                size:[40/2,2,320/2],
                position:[-22,20,-320/2],
                rotation:{
                    angle:new CANNON.Vec3(0,0,1),
                    range:-Math.PI * 0.5
                }
            },
            {
                size:[40/2,2,320/2],
                position:[22,20,-320/2],
                rotation:{
                    angle:new CANNON.Vec3(0,0,1),
                    range:-Math.PI * 0.5
                }
            },
            {
                size:[20,20,2],
                position:[0,20,-322],
                rotation:{
                    angle:new CANNON.Vec3(0,0,1),
                    range:-Math.PI * 0.5
                }
            },
            {
                size:[20,20,2],
                position:[0,20,2],
                rotation:{
                    angle:new CANNON.Vec3(0,0,1),
                    range:-Math.PI * 0.5
                }
            }
        ]
        wall.forEach(item=>{
            const halfExtents = new CANNON.Vec3(...item.size)
            const boxShape = new CANNON.Box(halfExtents)
            const face = new CANNON.Body({ mass: 0, shape: boxShape,material:physicsMaterials.wallMaterial});
            // @ts-ignore
            face.position.set(...item.position)
            if(item.rotation){
                face.quaternion.setFromAxisAngle(item.rotation.angle,item.rotation.range);
            }
            world.addBody(face)
        })
    }

    function sphereMove({code}:KeyboardEvent) {
        console.log("event.keyCode",code);

        const impulse=new CANNON.Vec3(0,0,0);
        const torque=new CANNON.Vec3(0,0,0);

        //ApplyImpulse 50
        //applyForce 500

        let impulseStrength=600 ;
        const torqueStrength=200 ;
        //如果本次按钮的方向和上次是相反的 需要将本次的力度加大此值为加大倍数
        let InverseMultiple=2

        switch (code) {
            case "KeyS":

                if(preCode==="KeyA"){
                    impulseStrength*=InverseMultiple
                }

                impulse.z+=impulseStrength
                torque.z+=torqueStrength
                break;
            case "KeyA":

                if(preCode==="KeyD"){
                    impulseStrength*=InverseMultiple
                }

                impulse.x-=impulseStrength
                torque.x-=torqueStrength
                break;
            case "KeyW":

                if(preCode==="KeyS"){
                    impulseStrength*=InverseMultiple
                }

                impulse.z-=impulseStrength
                torque.z-=torqueStrength
                break;
            case "KeyD":

                if(preCode==="KeyA"){
                    impulseStrength*=InverseMultiple
                }

                impulse.x+=impulseStrength
                torque.x+=torqueStrength
                break;
            case "Space":
                impulse.y+=impulseStrength
                torque.y+=torqueStrength
                break;
            case "KeyC":
            case "ShiftLeft":
            case "ControlLeft":

                impulse.y-=impulseStrength
                torque.y-=torqueStrength
                break;
        }


        //如果当前是上或者下，直接施加力
        if(["Space","ShiftLeft"].includes(code)){
            if(code==="Space"){
                impulse.y*=3
            }
            if(code==="ShiftLeft"){
                impulse.y*=3
            }
        }
        current.body.applyForce(impulse);
        current.body.applyTorque(torque);
        //存储之前的按键
        preCode=code;
    }

    function addBall() {
        const loader = new GLTFLoader(ins.loadManager);

        loader.load(
            "http://qrtest.qirenit.com:81/share/img/football/scene.gltf",(e)=>{
                let scale=2.0
                e.scene.scale.set(scale,scale,scale)
                e.scene.userData.isBall=true;
                e.scene.traverse(item=>{
                    item.castShadow=true;
                })

                console.log("足球对象：",e)


                const sphereShape = new CANNON.Sphere(2)
                const sphereBody = new CANNON.Body({ mass: 1, shape: sphereShape,material:physicsMaterials.ballMaterial })

                world.addBody(sphereBody)
                ins.scene.add( e.scene );

                sphereBody.position.set(0,10,-20)

                current={
                    // @ts-ignore
                    mesh:e.scene,
                    body:sphereBody
                }

                mrMap.push(current)
                window.onkeydown = throttle(sphereMove,100);

                let debugData={scale:2.0}

                ins.dat.add(debugData,"scale").min(-2).max(10).step(0.1).onChange(
                    (p:number)=>{
                        e.scene.scale.set(p,p,p)
                    }
                ).name("足球网格缩放")
            }
        )
    }

    function addTempDebug() {


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
            resetBallPosition(){
                current.body.sleep()
                current.body.position.set(0,2,-20);
            },
            pushOut(){
                current.body.sleep()
                current.body.position.set(18,2,-100);
            }
        }

        ins.dat.add(cameraDeviation,"x").min(-50).max(50).step(1).name("视角偏移 X ");
        ins.dat.add(cameraDeviation,"y").min(-50).max(50).step(1).name("视角偏移 Y ");
        ins.dat.add(cameraDeviation,"z").min(-50).max(50).step(1).name("视角偏移 Z ");
        ins.dat.add(debugParams,"addBox").name("随机添加正方体");
        ins.dat.add(debugParams,"resetBallPosition").name("重置足球位置");
        ins.dat.add(debugParams,"pushOut").name("尝试被挤出");
    }

    function initPlan() {
        const planeShape=new CANNON.Plane();
        const planeBody = new CANNON.Body({ mass: 0, shape:  planeShape })
        planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI * 0.5);
        world.addBody(planeBody)
    }

    function render(d:number) {
        delta=d;

        for (let i = 0; i <mrMap.length; i++) {
            let {mesh, body} = mrMap[i];
            // @ts-ignore
            mesh.position.copy(body.position)
            // console.log("位置：",body.position)
            // @ts-ignore
            mesh.quaternion.copy(body.quaternion)

            if (mesh.userData.isBall) {
                ins.camera.position.x = body.position.x + cameraDeviation.x;
                ins.camera.position.y = body.position.y + cameraDeviation.y;
                ins.camera.position.z = body.position.z + cameraDeviation.z;

                if(ins.camera.position.x>10){
                    ins.camera.position.x=10
                }
                if(ins.camera.position.x<-10){
                    ins.camera.position.x=-10
                }
                ins.camera.lookAt(body.position.x, body.position.y, body.position.z)

                ins.spotLight.position.set(-body.position.x, 80, body.position.z);
                ins.spotLight.target=mesh
                // ins.directLight.target=mesh
            }
        }

        // console.log("================")
        world.step(d);

        if(params.debug){
            cannonDebuggerIns.update();
        }
    }


    function destroy() {

    }

    return {
        world,
        mrMap,
        init,
        render,
        destroy,
        physicsMaterials
    }

}

export {
    usePhysics
}