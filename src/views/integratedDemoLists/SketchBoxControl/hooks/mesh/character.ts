import {MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial, Object3D} from "three";
import * as THREE from "three";

//调整材质和受光效果
export function captureBoxMan(t:Object3D) {

    // const axesHelper = new THREE.AxesHelper(2); // 参数表示坐标轴的长度

    // t.add(axesHelper)

    t.traverse(child => {
        // @ts-ignore
        if (child.isMesh) {
            child.castShadow =  true
            child.receiveShadow =true
            // https://discourse.threejs.org/t/cant-export-material-from-blender-gltf/12258
            // @ts-ignore
            // child.material.roughness = 0
            // @ts-ignore
            child.material.metalness = 0.8
        }
    })
}


export function setupMeshProperties(child: any): void
{
    child.castShadow = true;
    child.receiveShadow = true;

    if (child.material.map !== null)
    {
        let mat = new MeshLambertMaterial();


        // child.material.shininess = 0
        // child.material.roughness = 10
        // @ts-ignore
        // child.material.metalness = 0
        // mat.shininess = 0;
        // mat.reflectivity
        mat.name = child.material.name;
        mat.map = child.material.map;
        // @ts-ignore
        mat.map.anisotropy = 4;
        mat.aoMap = child.material.aoMap;
        mat.transparent = child.material.transparent;
        // @ts-ignore
        mat.skinning = child.material.skinning;
        // @ts-ignore
        mat.map.encoding = THREE.sRGBEncoding;

        child.material = mat;
    }
}

export function saveAnimation() {
    
}