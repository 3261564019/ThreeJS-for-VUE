import {Scene} from "three";
/**
 * 子场景的基类
 */
export abstract class ChildScene{
    //主场景对象
    public scene: Scene;
    protected constructor(scene:Scene) {
        this.scene = scene;
    }
    abstract  render(delta:number, elapsedTime:number):void
}