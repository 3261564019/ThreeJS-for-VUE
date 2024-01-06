import {Scene} from "three";
import {GMapIns} from "../../../types/Gmap";
import {GMapRender} from "../../index";
/**
 * 子场景的基类
 */
export abstract class ChildScene{
    //主场景对象
    public scene: Scene;
    public renderIns: GMapRender
    public mapIns: GMapIns
    protected constructor(scene:Scene,mapIns: GMapIns,renderIns: GMapRender) {
        this.scene = scene;
        this.mapIns = mapIns;
        this.renderIns = renderIns;
    }
    abstract  render(delta:number, elapsedTime:number):void
}