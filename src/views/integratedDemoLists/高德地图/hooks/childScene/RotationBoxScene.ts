
import * as THREE from "three";
import {BoxGeometry, Mesh, MeshPhongMaterial, Scene, TextureLoader} from "three";
import {GMapIns} from "../../types/Gmap";
import {GMapRender} from "../index";
import workerJs from "./workers/RotationBox.js?url"
import {ChildScene} from "./type/ChildScene";

export class RotationBoxScene extends ChildScene {
    private meshes: Array<Mesh> = []
    private readonly boxGeometry: BoxGeometry;
    private readonly mat: MeshPhongMaterial;
    private worker:Worker
    constructor(scene: Scene, mapIns: GMapIns, renderIns: GMapRender) {
        super(scene, mapIns, renderIns);
        this.worker = new Worker(workerJs);
        this.boxGeometry = new BoxGeometry(100, 100, 100);
        let texture = new TextureLoader().load('https://a.amap.com/jsapi_demos/static/demo-center-v2/three.jpeg');
        texture.minFilter = THREE.LinearFilter;
        this.mat = new MeshPhongMaterial({
            color: 0xfff0f0,
            depthTest: true,
            transparent: true,
            map: texture,
        })
    }
    addBox(center:number[]) {

        let mesh = new THREE.Mesh(this.boxGeometry, this.mat);
        let d = this.renderIns.latLongToPosition([
            center,
        ]);

        mesh.position.set(d[0][0], d[0][1], 10);

        this.meshes.push(mesh);

        this.scene.add(mesh);
    }
    render(delta: number, elapsedTime: number): void {
        for(let i =0;i<this.meshes.length;i++){
            this.meshes[i].rotation.z = elapsedTime
        }
        // if( this.worker){
        //     this.worker.postMessage({meshes:this.meshes,elapsedTime})
        // }
    }
}
