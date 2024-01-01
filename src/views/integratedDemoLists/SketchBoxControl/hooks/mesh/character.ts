import {Object3D} from "three";
import * as THREE from "three";

//调整材质和受光效果
export function captureBoxMan(t:Object3D) {

    const axesHelper = new THREE.AxesHelper(2); // 参数表示坐标轴的长度

    t.add(axesHelper)

    t.traverse(child => {
        // @ts-ignore
        if (child.isMesh) {
            child.castShadow =  true
            // child.receiveShadow =
            // https://discourse.threejs.org/t/cant-export-material-from-blender-gltf/12258
            // @ts-ignore
            child.material.roughness = 1
            // @ts-ignore
            child.material.metalness = 0
        }
    })
}

export function saveAnimation() {
    
}