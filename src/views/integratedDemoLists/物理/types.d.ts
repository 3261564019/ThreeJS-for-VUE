import {Mesh} from "three";
import * as CANNON from "cannon-es";


/**
 * 刚体和Mesh相匹配的对象类型
 */
export interface MeshRigid{
    mesh:Mesh,
    body:CANNON.Body
}

/**
 * 当前hooks导出的ins实例
 */
export interface PhysicIns{
    world:CANNON.World,
    mrMap:Array<MeshRigid>,
    init(params:PhysicInsParams):void,
    render(delta:number):void
    destroy():void,
    physicsMaterials:PhysicsMaterials
}

/**
 * 初始化当前hooks的参数
 */
export interface PhysicInsParams{
    debug?:Boolean
}
/**
 * 子场景
 */
export interface ChildScene{
    render(delta:number,elapsedTime:number):void
}
/**
 * 子场景
 */
export interface PhysicsMaterials{
    planMaterial:CANNON.Material,
    ballMaterial:CANNON.Material,
    wallMaterial:CANNON.Material
}
