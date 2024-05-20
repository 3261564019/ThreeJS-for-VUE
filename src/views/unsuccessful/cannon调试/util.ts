import * as CANNON from "cannon-es";
import {Vector3} from "three";

export function cannonToThreeVec3(cannonVec: CANNON.Vec3): Vector3 {
    return new Vector3(cannonVec.x, cannonVec.y, cannonVec.z);
}