import * as CANNON from "cannon-es";
import {BoxGeometry, Mesh, MeshNormalMaterial, SphereGeometry} from "three";
import {throttle} from "../../../utils";
import CannonDebugger from "cannon-es-debugger";
import {physicsBaseScene} from "./BaseScene";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import footBall from "@/assets/model/football/scene.gltf?url";
import {MeshRigid, PhysicInsParams} from "./types";


export function usePhysics(ins:physicsBaseScene){
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
    let ballMaterial:CANNON.Material;
    let planMaterial:CANNON.Material;

    function init(p:PhysicInsParams) {

        if(p){
            params=p;
            if(p.debug){
                // @ts-ignore
                cannonDebuggerIns= new CannonDebugger(ins.scene,world)
            }
        }

        addWalls();

        initPlan();
        
        intiMaterial();

        addTempDebug()

        addBall()
    }
    
    function intiMaterial() {
        planMaterial=new CANNON.Material("planMaterial");
        ballMaterial=new CANNON.Material("ballMaterial");

        let ballPlanMatch=new CANNON.ContactMaterial(
            planMaterial,
            ballMaterial,
            {
                //摩擦力
                friction:0.1,
                //回弹力度
                restitution:0.5,
                //很小会很软，类似水的材质 90 左右会回弹
                // contactEquationStiffness:200,
            }
        )

        world.addContactMaterial(ballPlanMatch)
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
            }
        ]
        wall.forEach(item=>{
            const halfExtents = new CANNON.Vec3(...item.size)
            const boxShape = new CANNON.Box(halfExtents)
            const face = new CANNON.Body({ mass: 0, shape: boxShape });
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
            case "ShiftLeft":
                impulse.y-=impulseStrength
                torque.y-=torqueStrength
                break;
        }


        //如果当前是上或者下，直接施加力
        if(["Space","ShiftLeft"].includes(code)){
            if(code==="Space"){
                impulse.y*=5
            }
            if(code==="ShiftLeft"){
                impulse.y*=5
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
            footBall,(e)=>{
                console.log(e)
                let scale=2.0
                e.scene.scale.set(scale,scale,scale)
                e.scene.userData.isBall=true;

                const sphereShape = new CANNON.Sphere(2)
                const sphereBody = new CANNON.Body({ mass: 1, shape: sphereShape,material:ballMaterial })

                world.addBody(sphereBody)
                ins.scene.add( e.scene );

                sphereBody.position.set(0,22,0)

                current={
                    // @ts-ignore
                    mesh:e.scene,
                    body:sphereBody
                }

                mrMap.push(current)
                window.onkeydown = throttle(sphereMove,100);

                let debugData={scale:2.0}

                ins.dat.add(debugData,"scale").step(0.1).onChange(
                    (p:number)=>{
                        e.scene.scale.set(p,p,p)
                    }
                )
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
            }
        }

        ins.dat.add(debugParams,"addBox").name("随机添加正方体");
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
            // @ts-ignore
            mesh.quaternion.copy(body.quaternion)

            if (mesh.userData.isBall) {
                ins.camera.position.x = body.position.x
                ins.camera.position.y = body.position.y + 60
                ins.camera.position.z = body.position.z + 60
                ins.camera.lookAt(body.position.x, body.position.y, body.position.z)
            }
        }
        world.step(d);

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