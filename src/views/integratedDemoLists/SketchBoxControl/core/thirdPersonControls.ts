/**
 * @description  This code has originally been copied from Sketchbook
 *
 * @author       swift502 <blaha.j502@gmail.com> (http://jblaha.art/)
 * @copyright    Copyright (c) 2018 swift502; Project Url: https://github.com/swift502/Sketchbook
 * @license      {@link https://github.com/swift502/Sketchbook/blob/master/LICENSE GPL-3.0}
 *
 * @author       Yannick Deubel (https://github.com/yandeu)
 * @copyright    Copyright (c) 2021 Yannick Deubel; Project Url: https://github.com/enable3d/enable3d
 * @license      {@link https://github.com/enable3d/enable3d/blob/master/LICENSE LGPL-3.0}
 */
import {Camera, MathUtils, MathUtils as THREE_Math, Object3D, Scene, Spherical, Vector2, Vector3} from 'three';
import {GUI} from "dat.gui";


interface Config {
    offset?: Vector3;
    sensitivity?: Vector2;
    radius?: number;
    targetRadius?: number;
    interpolationFactor?: number;
    pointerLock?: boolean;
    autoUpdate?: boolean;
    theta?: number;
    phi?: number;
    maxPhi?: number; // Max Phi in degrees
    minPhi?: number; // Min Phi in degrees
}

let worker:Worker;

class ThirdPersonControls {
    private camera: Camera;
    private target: Object3D;
    private config: any;
    private offset: Vector3;
    private sensitivity: Vector2;
    private radius: number;
    private targetRadius: number;
    private interpolationFactor: number;
    theta: number;
    private phi: number;
    private maxPhi: number;
    private minPhi: number;
    public dat: GUI;


    debugData={
        lerp:0.36,
        verticalEnhancement:0.6,
        speedXScale:0.8,
        speedYScale:1.2,
        allScale:1,
    }


    constructor(camera:Camera, target:Object3D, config:Config,dat:GUI) {
        this.camera = camera;
        this.target = target;
        this.config = config;
        const
            {
                offset = new Vector3(0, 0, 0),
                sensitivity = new Vector2(0.25, 0.25),
                radius = 8,
                targetRadius = 10,
                interpolationFactor = 0.05,
                pointerLock = true,
                autoUpdate = true,
                theta = 0,
                phi = 0,
                /** Max Phi in deg */
                maxPhi = 85,
                /** Min Phi in deg */
                minPhi = -85
            } = config;
        
        this.offset = offset;
        this.sensitivity = sensitivity;
        this.radius = radius;
        this.targetRadius = targetRadius;
        this.interpolationFactor = interpolationFactor;
        this.theta = theta;
        this.phi = phi;
        this.maxPhi = maxPhi;
        this.minPhi = minPhi;

        this.dat=dat

        this.addDebug()
    }
    addDebug(){
        this.dat.personControl.add(this.debugData,"lerp",0.001,1,0.001).name("摄像机Lerp")
        this.dat.personControl.add(this.debugData,"verticalEnhancement",0.001,1,0.001).name("垂直增强")
        this.dat.personControl.add(this.debugData,"speedXScale",0.001,1.5,0.001).name("水平灵敏度")
        this.dat.personControl.add(this.debugData,"speedYScale",0.001,1.5,0.001).name("垂直灵敏度")
        this.dat.personControl.add(this.debugData,"allScale",0.001,3.5,0.001).name("整体灵敏度")
    }
    update(deltaX:number=0, deltaY:number=0) {
        deltaX*=this.debugData.speedXScale
        deltaY*=this.debugData.speedYScale
        deltaX*=this.debugData.allScale
        deltaY*=this.debugData.allScale

        const target = this.target.position.clone().add(this.offset);
        this.theta -= deltaX * (this.sensitivity.x / 2);
        this.theta %= 360;
        this.phi += deltaY * (this.sensitivity.y / 2);
        this.radius = THREE_Math.lerp(this.radius, this.targetRadius, this.interpolationFactor);

        /**
         * 传入新的theta和phi和上次的进行插值，如果一开始没有值就直接返回新的
         * 行不通，不是在两次位移间插值，而是从当前相机的phi和theta到目标phi和theta进行插值
         */
        //相机位置对应的俯仰角
        let {phi, theta}=cartesianToSpherical(this.camera.position,target);
        //从当前位置过渡到
        let tPhi=MathUtils.lerp(phi,this.phi,this.debugData.lerp+this.debugData.verticalEnhancement)
        let tTheta=interpolateTheta(theta,this.theta,this.debugData.lerp)
        //限制俯仰角的范围
        tPhi =Math.max(this.minPhi, Math.min(this.maxPhi, tPhi));

        let targetPosition=new Vector3()
        targetPosition.x =
            target.x + this.radius * Math.sin((tTheta * Math.PI) / 180) * Math.cos((tPhi * Math.PI) / 180);
        targetPosition.y =
            target.y + this.radius * Math.sin((tPhi * Math.PI) / 180);
        targetPosition.z =
            target.z + this.radius * Math.cos((tTheta * Math.PI) / 180) * Math.cos((tPhi * Math.PI) / 180);

        this.camera.position.copy(targetPosition)

        this.camera.lookAt(target);
    }
}


/**
 * 格局相机位置计算相机的俯仰角和水平角
 * @param position
 * @param target
 */
function cartesianToSpherical(position: Vector3, target: Vector3): { theta: number, phi: number } {
    // 计算相对目标的偏移量
    const dx = position.x - target.x;
    const dy = position.y - target.y;
    const dz = position.z - target.z;

    // 计算俯仰角 phi (0 ~ 180)
    const phi = Math.atan2(Math.sqrt(dx * dx + dz * dz), dy) * (180 / Math.PI);

    // 计算水平角 theta (0 ~ 360)
    let theta = Math.atan2(dz, dx) * (180 / Math.PI);

    // 将theta旋转90度，并反向映射
    theta = (theta + 90) % 360;

    // 将映射的角度进行180度对称转换，确保符合预期
    if (theta <= 180) {
        theta = 180 - theta;
    } else {
        theta = 540 - theta; // 360 + (180 - theta)
    }

    return {
        theta,
        phi
    };
}


/**
 * 插值theta（水平角）处理边界问题，取最短路径
 * @param thetaStart
 * @param thetaEnd
 * @param t
 */
function interpolateTheta(thetaStart: number, thetaEnd: number, t: number): number {
    // 确保角度在 [0, 360) 范围内
    thetaStart = (thetaStart + 360) % 360;
    thetaEnd = (thetaEnd + 360) % 360;

    // 计算角度差
    let deltaTheta = thetaEnd - thetaStart;

    // 如果差值大于180度，选择更短的插值路径，跨越0°
    if (deltaTheta > 180) {
        deltaTheta -= 360; // 选择负方向跨越
    } else if (deltaTheta < -180) {
        deltaTheta += 360; // 选择正方向跨越
    }

    // 插值并返回最终的theta，确保角度在 [0, 360) 范围内
    return (thetaStart + deltaTheta * t + 360) % 360;
}


export { ThirdPersonControls };