import {ChildScene} from "../../types";
import {BoxGeometry, Mesh, MeshPhongMaterial, Scene, TextureLoader} from "three";
import * as THREE from "three";
import {GMapIns} from "../../types/Gmap";
import {GMapRender} from "../index";
export class RotationBox extends ChildScene {
    private meshes: Array<Mesh> = []
    constructor(scene: Scene, mapIns: GMapIns, renderIns: GMapRender,center:number[],size?:number) {
        super(scene, mapIns, renderIns);
        this.createBox(center,size);
    }
    createBox(center:number[],size:number=100) {
        let texture = new TextureLoader().load('https://a.amap.com/jsapi_demos/static/demo-center-v2/three.jpeg');
        texture.minFilter = THREE.LinearFilter;
        //  这里可以使用 three 的各种材质
        let mat = new MeshPhongMaterial({
            color: 0xfff0f0,
            depthTest: true,
            transparent: true,
            map: texture,
        });
        let geo = new BoxGeometry(size, size, size);

        let mesh = new THREE.Mesh(geo, mat);
        let d = this.renderIns.latLongToPosition([
            center,
        ]);
        console.log("转换过后的经纬度", d)

        mesh.position.set(d[0][0], d[0][1], 10);
        this.meshes.push(mesh);

        this.scene.add(mesh);
    }
    render(delta: number, elapsedTime: number): void {
        this.meshes.forEach((mesh) => {
            mesh.rotation.z = elapsedTime
        })
    }
}