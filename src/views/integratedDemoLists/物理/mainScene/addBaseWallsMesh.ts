import {physicsBaseScene} from "../BaseScene";
import {BoxGeometry, Color, Mesh, MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial} from "three";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import belfast_sunset_pure_sky_4k from "@/assets/hdr/belfast_sunset_puresky_4k.hdr?url";

export class AddBaseWallsMesh {
    private ins: physicsBaseScene;

    constructor(ins: physicsBaseScene) {
        this.ins = ins;


        let wallArr = [
            {
                size: [4, 20, 320],
                position: [-22, 10, -320 / 2],
                rotation: [0, 0, 0]
            },
            {
                size: [4, 20, 320],
                position: [22, 10, -320 / 2],
                rotation: [0, 0, 0]
            },
            {
                size: [48, 20, 4],
                position: [0, 10, -322],
                rotation: [0, 0, 0]
            }
        ]


        let material = new MeshStandardMaterial({color: "#ae9a98"})
        // let material=new MeshPhongMaterial({ map:texture})
        material.roughness=1;
        material.metalness=0;

        // ins.dat.add(material,"roughness").min(-2).max(2).step(0.01)
        // ins.dat.add(material,"metalness").min(-2).max(2).step(0.01)
        // ins.dat.addColor(material,"color").name("aaa")

        for (let i = 0; i < wallArr.length; i++) {
            let geometry = new BoxGeometry(...wallArr[i].size);
            let mesh = new Mesh(geometry, material);
            mesh.receiveShadow=true
            // @ts-ignore
            mesh.position.set(...wallArr[i].position)
            // @ts-ignore
            mesh.rotation.set(...wallArr[i].rotation)
            ins.scene.add(mesh)
        }


    }
}