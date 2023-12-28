import {AnimationAction} from "three";

export interface Updatable {
    render:(delta:number,elapsedTime:number)=>void
}

//键盘行为
export interface KeyAction {
    a: { isDown: boolean };
    s: { isDown: boolean };
    d: { isDown: boolean };
    w: { isDown: boolean };
    space: { isDown: boolean }
}

export class MyAnimationAction extends AnimationAction{
    Play:()=>AnimationAction
}