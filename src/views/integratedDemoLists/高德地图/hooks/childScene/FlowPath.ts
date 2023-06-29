import {ChildScene} from "../../types";
import {BoxGeometry, CatmullRomCurve3, Mesh, MeshBasicMaterial, Scene, Vector3} from "three";
import {GMapIns} from "../../types/Gmap";
import {GMapRender} from "../index";

export interface FlowPathParams{
    scene: Scene
    mapIns: GMapIns
    renderIns: GMapRender
    path:Array<number[]>
    //流动速度，默认为1
    speed?:number,
    //线段数量
    size:number,
    height:number[]
}
export class FlowPath extends ChildScene {
    private p:FlowPathParams
    private curve: CatmullRomCurve3;
    private splitLineArr:Mesh[];
    constructor(p:FlowPathParams) {
        super(p.scene,p.mapIns,p.renderIns);
        this.p = p;
        this.splitLineArr=[]
        // @ts-ignore
        this.createPath(this.mapIns.customCoords.lngLatsToCoords(p.path));
    }

    createPath(path: Array<number[]>[]){

        console.log("转换后",path)

        let points:Vector3[]=[]

        path.forEach((item,index)=>{
            // @ts-ignore
            points.push(new Vector3(item[0],item[1],this.p.height[index]))
        })

        console.log("points",points)

        this.curve = new CatmullRomCurve3(points)

        const geometry = new BoxGeometry(5, 5, 20);
        const material = new MeshBasicMaterial({color: 0x00ff00});
        let splitLine = new Mesh(geometry, material);

        //创建虚线的小结
        for (let i = 0; i < this.p.size; i++) {
            // splitLine.position.set(i*2,0,0)
            let t = splitLine.clone()
            this.splitLineArr.push(t)
            this.scene.add(t)
        }

        console.log(this.splitLineArr)
    }
    render(delta: number, elapsedTime: number): void {
        if (this.curve) {
            // console.log("参数",this.p.size)
            this.splitLineArr.forEach((v, index) => {
                let at = (index / this.p.size) + (elapsedTime % this.p.size) / (this.p.speed ?? 1)*this.p.size
                if (at > 1) {
                    at %= 1
                }
                let position = this.curve.getPointAt(at);
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
