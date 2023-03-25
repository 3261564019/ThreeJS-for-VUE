import {physicsBaseScene} from "../BaseScene";
import {BoxGeometry, Mesh, MeshPhongMaterial} from "three";

export class AddBaseWallsMesh {
    private ins: physicsBaseScene;
    constructor(ins:physicsBaseScene) {
        this.ins=ins;


        let wallArr=[
            {
                size:[4,20,320],
                position:[-22,10,-320/2],
                rotation:[0,0,0]
            },
            {
                size:[4,20,320],
                position:[22,10,-320/2],
                rotation:[0,0,0]
            },
            {
                size:[48,20,4],
                position:[0,10,-322],
                rotation:[0,0,0]
            }
        ]

        let material=new MeshPhongMaterial({color:"#ae9a98"})

        for(let i=0;i<wallArr.length;i++){
            let geometry=new BoxGeometry(...wallArr[i].size);
            let mesh=new Mesh(geometry,material);
            // @ts-ignore
            mesh.position.set(...wallArr[i].position)
            // @ts-ignore
            mesh.rotation.set(...wallArr[i].rotation)
            ins.scene.add(mesh)
        }



    }
}