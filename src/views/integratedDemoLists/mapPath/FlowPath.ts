import {
    BoxGeometry,
    BufferGeometry,
    CatmullRomCurve3, Color,
    Group,
    Mesh,
    MeshBasicMaterial,
    NormalBufferAttributes,
    Vector3
} from "three";
import * as THREE from "three";
import {BaseScene} from "@/views/integratedDemoLists/mapPath/BaseScene";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import t from "@/assets/model/t.glb?url"

export class FlowPath {
    private curve: CatmullRomCurve3;
    private splitLineArr: Mesh<BufferGeometry<NormalBufferAttributes>,MeshBasicMaterial>[]=[];
    private ins: BaseScene;
    private g:Group=new Group();
    private segmentSize: number;
    private loaded: GLTFLoader;
    private color:Color;
    constructor(
        path:Vector3[],
        segmentSize:number,
        ins:BaseScene,
        color:Color
        ) {
        this.loaded=new GLTFLoader();

        this.ins=ins;
        this.segmentSize=segmentSize;
        const material = new THREE.MeshBasicMaterial({color});

        this.loaded.load(t,(e)=>{
            console.log(e.scene)
            let t=e.scene;
            t.traverse(v=>{
                if (v.isMesh) {
                    v.material=material;
                }
            })
            t.scale.set(0.1,0.1,0.12)
            this.ins.scene.add(t);
            this.createLine(path,segmentSize,e.scene);
        })

    }

    private createLine(path: Vector3[], segmentSize: number,m:Group) {
        this.curve = new CatmullRomCurve3(path)

        const geometry = new BoxGeometry(0.2, 0.2, 0.7);
        const material = new MeshBasicMaterial({color:new Color("#f00")});
        let splitLine = new Mesh(geometry, material);

        //创建虚线的小结
        for (let i = 0; i < segmentSize; i++) {
            // splitLine.position.set(i*2,0,0)
            let t = m.clone()
            this.splitLineArr.push(t)
            this.g.add(t)
        }

        this.ins.scene.add(this.g)
    }
    render(Elapsed:number){
        if (this.curve) {
            this.splitLineArr.forEach((v, index) => {

                let t=this.segmentSize
                let at = (index / t) + (Elapsed % t) / t
                if (at > 1) {
                    at %= 1
                }
                let position = this.curve.getPointAt(at) as THREE.Vector3;

                let tangent=this.curve.getTangentAt(at);
                // console.log(tangent);
                let lookAtVec=tangent.add(position);
                v.lookAt(lookAtVec)
                // @ts-ignore
                v.position.set(...position)
            })
        }
    }
}