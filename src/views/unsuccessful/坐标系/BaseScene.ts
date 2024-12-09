import {
    ACESFilmicToneMapping, AxesHelper, BoxGeometry,
    DoubleSide,
    Mesh,
    MeshLambertMaterial,
    PlaneGeometry, ShapeGeometry, SphereGeometry,
    SpotLight, Vector3
} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";

export class BaseScene extends BaseInit {

    private plane: Mesh<PlaneGeometry, MeshLambertMaterial>
    box: Mesh<BoxGeometry, MeshLambertMaterial>;

    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            needAxesHelper:true,
            renderDomId:"#renderDom"
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.addPlan();

        this.addLight();

        this.addDebug()

        this.animate()
    }
    addDebug(){
        let t={
            t1:()=>{
                //新创建的球体p，希望加到box上
                let p=new Mesh(new SphereGeometry(1,30),new MeshLambertMaterial({color:"#0f0"}))
                //添加之前将p的初始值为0,0,0的位置转为世界坐标系
                p.translateZ(6);

                p.add(new AxesHelper(4))
                this.box.add(p);
                let t=new Vector3(0,0,0)
                // p.worldToLocal(new Vector3(0,0,0))
                p.lookAt(t)
                // this.box.worldToLocal(p.position)
                //再进行添加
                console.log(p.matrixWorld)
                console.log(p.matrix)
                console.log("-----------")
                p.updateMatrixWorld()
                let box=new Mesh(new BoxGeometry(3,3),new MeshLambertMaterial({color:"#0022ff"}))
                box.applyMatrix4(p.matrixWorld)
                this.scene.add(box);



                // this.plane.applyMatrix4(p.matrixWorld);
                //此时p.position的x为-10
                // console.log('p',p.position)
            },
            t2:()=>{

            }
        }
        this.dat.add(t,"t1").name("aa")
        // this.dat.add(t,"t2").name("添加立方体")
    }
    addPlan(){

        const geometry = new PlaneGeometry(10, 10);
        const material = new MeshLambertMaterial({color: 0x222222});
        material.side=DoubleSide
        const plane = new Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true
        // plane.rotateX(Math.PI/2)
        plane.position.x = 10;
        plane.position.y = 0;
        plane.position.z = 0;

        let box=new Mesh(new BoxGeometry(3,3),new MeshLambertMaterial({color:"#f00"}))
        plane.add(box)
        // box.position.x=-2;
        this.plane=plane
        this.box=box
        //添加地板容器
        this.scene.add(plane);

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
        // this.renderer.outputColorSpace = LinearEncoding;
        this.control.enableDamping=true;
        this.control.dampingFactor = 0.08;
        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 0, 60);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

    }
    animate(){

        // this.plane.position.x+=0.01;

        this.control.update()
        this.stats.update()
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }
}