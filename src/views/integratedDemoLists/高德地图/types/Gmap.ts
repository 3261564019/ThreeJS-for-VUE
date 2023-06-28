import {Vector3} from "three";

//高德地图的实例
export interface GMapIns{
    customCoords:CustomCoords
}

interface CameraParams {
    position:Vector3
    lookAt:Vector3
    up:Vector3
}

export interface CustomCoords {
    lngLatsToCoords: (lngLats: Array<number[]>[])=>Array<number[]>[]

    getCameraParams(): CameraParams;

    setCenter(numbers: number[]): void;
}

/*
    marker 和 其对应的弹窗组件的映射
 */
export interface MakerWithCmp{
    // 关闭当前窗体及组件实例 只有打开状态才存在该方法
    close?:Function;
    //当前marker
    marker:any
    //通过import 引入的组件对象
    component:any,
    //当前是否在打开状态  opening:打开   可能为null
    state:string|null,
    // 会在创建组件时调用组件实例的setData方法将该值传进去
    additionalData?:any
}

export interface SetDataParams{
    data:any | null,
    destroy:Function
}