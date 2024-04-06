import {
    BoxGeometry,
    Group,
    InstancedMesh,
    Matrix4,
    Mesh,
    MeshPhysicalMaterial,
    Scene,
    Vector3
} from "three";

/**
 * 处理树的例子
 * @param scene
 */
export function captureTrees(scene:Group,trees:Mesh[],mainScene:Scene) {
    let im=[]

    // @ts-ignore
    let emptyObjs:Mesh[]=scene.getObjectByName("绿地")?.children

    console.log("emptyObjs",emptyObjs)

    let map:Map<number,Mesh[]>=new Map()

    emptyObjs.forEach(e=>{
        // @ts-ignore
        let i=e.userData.index
        let arr=map.get(i)
        if(arr){
            arr.push(e)
        }else{
            map.set(i,[e])
        }
    })

    console.log("map",map)

    trees.forEach((v,i)=>{

        const geometry = new BoxGeometry( 1, 1, 1 );
        const material = new MeshPhysicalMaterial({color: 0x00ff00} );

        let eos=map.get(i)

        const instancedMesh = new InstancedMesh(v.geometry, v.material, eos?.length);

        eos?.forEach((v,i)=>{
            const matrix = new Matrix4();
            let p=new Vector3()
            v.getWorldPosition(p)
            matrix.compose( p, v.quaternion, v.scale );
            instancedMesh.setMatrixAt(i, matrix);
        })

        instancedMesh.instanceMatrix.needsUpdate = true;
        console.log("ins",instancedMesh)
        mainScene.add(instancedMesh)
    })

    console.log("sss",trees)
}

/**
 * 创建路灯
 * @param scene
 * @param trees
 * @param mainScene
 */
export function captureLight(scene:Group,trees:Mesh[],mainScene:Scene){
    // @ts-ignore
    let light:Mesh=scene.getObjectByName("路灯")!
    let g=light?.userData.position;
    console.log("路灯",light)
    let p=new Vector3()
    const instancedMesh = new InstancedMesh(light.geometry, light.material, 3);
    // @ts-ignore
    light.getWorldPosition(p)
    for(let i=0; i< 3;i++){
        p.x-=0.97;
        const matrix = new Matrix4();
        matrix.compose( p, light.quaternion,light.scale );
        instancedMesh.setMatrixAt(i, matrix);

        console.log(i)
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
    console.log("ins",instancedMesh)
    mainScene.add(instancedMesh)
}

/**
 * 灌木
 * @param scene
 * @param trees
 * @param mainScene
 */
export function captureShrub(scene:Group,trees:Mesh[],mainScene:Scene) {
    // @ts-ignore
    let left:Mesh=scene.getObjectByName("灌木左baked")!;
    let e=scene.getObjectByName("empty-灌木右")!;
    const instancedMesh = new InstancedMesh(left.geometry, left.material, 1);

    const matrix = new Matrix4();
    matrix.compose( e?.position, e.quaternion,e.scale );
    instancedMesh.setMatrixAt(0, matrix);

    mainScene.add(instancedMesh)

}