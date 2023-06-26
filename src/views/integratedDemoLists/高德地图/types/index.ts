import {Scene} from "three";

export abstract class ChildScene{
    public scene: Scene;
    constructor(scene:Scene) {
        this.scene = scene;
    }
    abstract  render(delta:number, elapsedTime:number):void
}