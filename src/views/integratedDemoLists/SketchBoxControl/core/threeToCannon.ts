import {BufferGeometry, Mesh, Object3D, Quaternion} from "three";
import * as CANNON from "cannon-es";

/**
 * 返回一个平面数组THREE。给定对象的网格实例。如果
 * 找到嵌套变换，将其应用于子网格
 * 作为mesh.userData.matrix，以便每个网格都有其位置/旋转/缩放
 * 独立于除顶层对象之外的所有父对象。
 * @param  {THREE.Object3D} object
 * @return {Array<THREE.Mesh>}
 */
function getMeshes (object:Object3D):Array<Mesh> {
    let meshs:Mesh[] = [];
    object.traverse(function (o) {
        if (o.type === 'Mesh') {
            // @ts-ignore
            meshs.push(o);
        }
    });
    return meshs;
}


/**
 * @param  {THREE.BufferGeometry} geometry
 * @return {CANNON.Shape}
 */
function createTriMeshShape (geometry:BufferGeometry) {
    let   vertices = geometry.attributes.position;
    console.log("顶点",vertices)
    // @ts-ignore
    const indices = geometry.getIndex().array;
    // @ts-ignore
    return new CANNON.Trimesh(vertices.array, indices);
}

function threeMeshToCannon() {

}

function threeToCannonQuaternion(threeQuaternion:Quaternion) {
    return new CANNON.Quaternion(threeQuaternion.x, threeQuaternion.y, threeQuaternion.z, threeQuaternion.w);
}

export {createTriMeshShape,getMeshes,threeToCannonQuaternion}