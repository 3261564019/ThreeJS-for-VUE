import {
    AxesHelper, Box3,
    BoxGeometry, BufferGeometry,
    Group,
    InstancedMesh,
    Matrix4,
    Mesh, MeshBasicMaterial,
    MeshPhysicalMaterial, MeshStandardMaterial,
    Scene,
    Vector3
} from "three";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import fontFile from "@/assets/font/xn.json?url"
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
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

/**
 * 删掉犀鸟校园的mesh换成font
 * @param scene
 * @param trees
 * @param mainScene
 */
export function captureFont(scene:Group,trees:Mesh[],mainScene:Scene) {
    return  new Promise(resolve => {

        let xn:Mesh<BufferGeometry,MeshStandardMaterial>=scene.getObjectByName("文本")!;
        let fontPosition=xn.position;
        xn.geometry.dispose();
        xn.material.dispose();
        console.log("xxx",xn)
        console.log("ppp",xn.parent)
        let i=xn.parent.children.findIndex(v=>v.name==xn.name)
        xn.parent?.children.splice(i,1)
        const loader = new FontLoader();
        loader.load(
            // resource URL
            fontFile,

            // onLoad callback
            function ( font ) {
                // do something with the font
                console.log("字体", font );

                let textGeo = new TextGeometry( "犀鸟校园", {
                    font: font,
                    size: 0.1,
                    depth: 0,
                    curveSegments: 8,
                    bevelThickness: 20,
                    bevelSize: 8,
                } );

                let mesh = new Mesh( textGeo, new MeshBasicMaterial({color:"#fff"}));
                mesh.position.copy(fontPosition)
                mesh.scale.setZ(0.0002)
                xn.parent.children.push(mesh);

                const boundingBox = new Box3().setFromObject(mesh);

                // 计算 Mesh 的宽度和高度
                const width = boundingBox.max.x - boundingBox.min.x;
                const height = boundingBox.max.y - boundingBox.min.y;

                // 计算平移量
                const translateX = width / 2;
                const translateY = height / 2;

                // 在全局坐标系中将 Mesh 平移
                mesh.position.x -= translateX;
                mesh.position.y -= translateY;

                mesh.add(new AxesHelper(1))
                console.log("字体Mesh",mesh)

                resolve(1)
            }
        )
    })
}