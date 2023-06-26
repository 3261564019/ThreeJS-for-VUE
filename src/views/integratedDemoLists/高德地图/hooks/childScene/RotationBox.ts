import {ChildScene} from "../../types";
import {BoxGeometry, Mesh, MeshPhongMaterial, Scene, TextureLoader} from "three";
import * as THREE from "three";

export class RotationBox extends ChildScene{

    private meshes:Array<{mesh:Mesh,count:number}>=[]

    constructor(scene:Scene,arr:Array<number[]>) {
        super(scene);
        this.createBox(arr);
    }
    createBox(data:Array<number[]>){
        let texture = new TextureLoader().load('https://a.amap.com/jsapi_demos/static/demo-center-v2/three.jpeg');
        texture.minFilter = THREE.LinearFilter;
        //  这里可以使用 three 的各种材质
        let mat = new MeshPhongMaterial({
            color: 0xfff0f0,
            depthTest: true,
            transparent: true,
            map: texture,
        });
        let geo = new BoxGeometry(100, 100, 100);

        for (let i = 0; i < data.length; i++) {
            const d = data[i];
            let mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(d[0], d[1], 30);
            this.meshes.push({
                mesh,
                count: i,
            });
            this.scene.add(mesh);
        }

    }
    render(delta: number, elapsedTime: number): void {
        this.meshes.forEach(({mesh})=>{
            mesh.rotation.z=elapsedTime
        })
    }
}