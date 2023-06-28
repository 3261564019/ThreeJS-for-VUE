import {Scene} from "three";
import {GMapIns} from "./Gmap";
import {GMapRender} from "../hooks";

/**
 * 子场景的基类
 */
export abstract class ChildScene{
    //主场景对象
    public scene: Scene;
    //高德地图实例
    public mapIns: GMapIns;
    //
    public renderIns: GMapRender;
    protected constructor(scene:Scene, mapIns:GMapIns,renderIns:GMapRender) {
        this.scene = scene;
        this.mapIns = mapIns;
        this.renderIns = renderIns;
    }
    abstract  render(delta:number, elapsedTime:number):void
}