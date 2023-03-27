import {physicsBaseScene} from "../BaseScene";
import {MeshRigid} from "../types";
import * as CANNON from "cannon-es";
import {BoxGeometry, Mesh, MeshNormalMaterial} from "three";
import {box} from "echarts/types/src/util/layout";

function useConstraint(word: CANNON.World, ins: physicsBaseScene,fixedPosition:{x:number,y:number,z:number}) {

    let mrMap: Array<MeshRigid> = [];
    //
    // const halfExtents = new CANNON.Vec3(2, 2, 2)
    // const boxShape = new CANNON.Box(halfExtents)
    // const boxBody = new CANNON.Body({mass: 0, shape: boxShape});
    //
    // boxBody.position.set(0,20,-10)
    // const geometry = new BoxGeometry(4, 4, 4);
    // const material = new MeshNormalMaterial();
    // const cube = new Mesh(geometry, material);
    // //
    // word.addBody(boxBody)
    // ins.scene.add(cube)


    // {
    //     const halfExtents = new CANNON.Vec3(2, 2, 2)
    //     const boxShape = new CANNON.Box(halfExtents)
    //     const innerBoxBody = new CANNON.Body({mass: 3, shape: boxShape});
    //
    //     const geometry = new BoxGeometry(4, 4, 4);
    //     const material = new MeshNormalMaterial();
    //     const cubea = new Mesh(geometry, material);
    //     //
    //
    //     const localPivotA = new CANNON.Vec3(-2, -2, 2)
    //     //         //前者的约束点
    //             const localPivotB = new CANNON.Vec3(-2,-2,-2)
    //     //
    //     innerBoxBody.position.set(0,6,-30)
    //
    //             // const constraint = new CANNON.PointToPointConstraint(boxBody, localPivotA, innerBoxBody, localPivotB,5);
    //             const constraint1 = new CANNON.PointToPointConstraint(boxBody, new CANNON.Vec3(2, -2, 2), innerBoxBody, new CANNON.Vec3(2, 2, 2),1);
    //     // word.addConstraint(constraint)
    //     word.addConstraint(constraint1)
    //     word.addBody(innerBoxBody)
    //     ins.scene.add(cubea)
    //
    //     mrMap.push({
    //         mesh: cubea,
    //         body: innerBoxBody
    //     })
    // }


    // mrMap.push({
    //     mesh: cube,
    //     body: boxBody
    // })

    // debugger

    const material = new MeshNormalMaterial();


    for (let i = 10; i > 0; i--) {
        let size = i/2
        console.log("Size",size)
        const halfExtents = new CANNON.Vec3(size / 2, size / 2, 1)
        const boxShape = new CANNON.Box(halfExtents)
        let boxBody;

        if(i===10){
            boxBody=new CANNON.Body({mass:0, shape: boxShape});
            // @ts-ignore
            boxBody.position.set(fixedPosition.x,fixedPosition.y,fixedPosition.z)
            boxBody.mass=0;
        }else{
            boxBody=new CANNON.Body({mass:2, shape: boxShape});
            boxBody.position.set(fixedPosition.x,10,-i*10 -20)
        }

        //确保数组中已经有内容
        if (mrMap.length) {
            let preBody = mrMap[mrMap.length - 1].body;
            //取当前数组最后一个与自己建立约束
            //当前box的约束点
            const localPivotA = new CANNON.Vec3(-size / 2, size/2, -size/2)
            //前者的约束点
            // @ts-ignore
            const localPivotB = new CANNON.Vec3(-preBody.shapes[0].halfExtents.x, -preBody.shapes[0].halfExtents.y, -preBody.shapes[0].halfExtents.z)


            console.log(size,"约束：",localPivotA,localPivotB)

            const constraint = new CANNON.PointToPointConstraint(boxBody, localPivotA, preBody, localPivotB,8);

            word.addConstraint(constraint)
        }

        const geometry = new BoxGeometry(size, size, 2);
        const cube = new Mesh(geometry, material);



        console.log("计算出的位置",boxBody.position)

        ins.scene.add(cube)
        word.addBody(boxBody)

        mrMap.push({
            mesh: cube,
            body: boxBody
        })

    }

    return {
        mrMap
    }
}


export {
    useConstraint
}