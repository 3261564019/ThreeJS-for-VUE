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
    marker:AMap.Marker
    //创建出的组件实例
    cmp:any,
    //当前是否在打开状态  opening:打开   可能为null
    state:string|null,
    //会在创建组件时调用组件实例的setData方法将该值传进去
    additionalData:any
}