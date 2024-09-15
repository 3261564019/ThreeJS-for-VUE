import * as CANNON from "cannon-es";
import {MathUtils, Vector3} from "three";

/** * 创建角色刚体
 */
export function createBoxManBody(){

    const radius = 0.6; // 圆柱体底面半径
    const height = 0.8; // 圆柱体高度

    //创建圆柱体
    const cylinderShape = new CANNON.Cylinder(0.3, 0.008, 0.3, 8);
    //任务底部的球体，为了更好的模拟摩擦，球体底部与其他面接触小
    const Sphere = new CANNON.Sphere(0.3);

    // let initPosition={
    //     "x": -107.21359457306761,
    //     "y": 16.08179785930693,
    //     "z": 64.64106772369107
    // }

    let initPosition={
        "x": -0.31684331040979863,
        "y": 18.943271496888876,
        "z": 47.302501131327006
    }

    const body = new CANNON.Body({
        mass: 1, // 质量
        position: new CANNON.Vec3(initPosition.x,initPosition.y+0.8,initPosition.z) // 位置
    });

    //圆柱体向前倾斜以便更好模拟任务形态
    const localQuaternion = new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(1,0,0),MathUtils.degToRad(10)); // 形状2的本地旋转
    // body.addShape(cylinderShape,new CANNON.Vec3(0, 0.4, 0.045),localQuaternion)
    // body.addShape(cylinderShape)
    body.addShape(Sphere)


    body.updateAABB()
    //只允许其沿着y轴旋转
    body.angularFactor.set(0, 0, 0);

    return body
}

export function threeVector(vec: CANNON.Vec3):Vector3
{
    return new Vector3(vec.x, vec.y, vec.z);
}
