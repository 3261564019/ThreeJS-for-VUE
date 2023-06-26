import {Vector3} from "three";

export interface GMapIns{
    customCoords:CustomCoords

    // add(gllayer:): void;
}

interface CameraParams {
    position:Vector3
    lookAt:Vector3
    up:Vector3
}

export interface CustomCoords {
    lngLatsToCoords:(lngLats:Array<number[]>)=>(Array<number[]>)

    getCameraParams(): CameraParams;

    setCenter(numbers: number[]): void;
}