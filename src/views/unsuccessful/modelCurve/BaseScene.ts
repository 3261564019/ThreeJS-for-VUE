import {
    ACESFilmicToneMapping, CatmullRomCurve3,
    DoubleSide,
    Mesh,
    MeshLambertMaterial,
    PlaneGeometry,
    SpotLight, Vector3
} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import aa from "@/assets/model/display/modelCurve.glb?url"
import * as THREE from "three";
import {c} from "vite/dist/node/types.d-aGj9QkWt";

function reorderVertices(vertices) {
    const ordered = [];
    const visited = new Set();

    // 从第一个顶点开始
    let current = vertices[0];
    ordered.push(current);
    visited.add(0);

    // 按距离最近顺序寻找下一个点
    while (ordered.length < vertices.length) {
        let nearestIndex = -1;
        let nearestDistance = Infinity;

        vertices.forEach((vertex, index) => {
            if (visited.has(index)) return;
            const distance = current.distanceTo(vertex);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestIndex = index;
            }
        });

        if (nearestIndex !== -1) {
            current = vertices[nearestIndex];
            ordered.push(current);
            visited.add(nearestIndex);
        }
    }

    return ordered;
}


export class BaseScene extends BaseInit {
    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            needAxesHelper:true,
            needGLTFLoader:true,
            renderDomId:"#renderDom"
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.addPlan();

        this.addLight();


        this.animate()
    }
    addPlan(){

        let pointsArr=[]
        this.gltfLoader.load(aa,(gltf)=>{

            let arr=gltf.scene.children[0].geometry.attributes.position
            for (let i = 0; i < arr.count; i++) {
                pointsArr.push(new Vector3(arr.array[i*3],arr.array[i*3+1],arr.array[i*3+2]))
            }

            let curve=  new CatmullRomCurve3(reorderVertices(pointsArr));

            const points = curve.getPoints( 30 );
            // //通过点队列设置该 BufferGeometry 的 attribute。
            const geometry = new THREE.BufferGeometry().setFromPoints( points );
            // //线条材质
            const material = new THREE.LineBasicMaterial( { color:"#f00"} );
            // //创建图形并加入场景
            const curveObject = new THREE.Line( geometry, material );
            //
            //
            this.scene.add(curveObject)
        })

    }
    addLight(){

        //创建聚光灯
        const light = new SpotLight("#fff");
        light.castShadow = true;            // default false
        light.position.x = 20;
        light.position.y = 30;

        this.scene.add(light);
    }
    init() {

        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.9;
        this.control.enableDamping=true;
        this.control.dampingFactor = 0.08;
        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 0, 60);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

    }
    animate(){

        this.control.update()
        this.stats.update()
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }
}