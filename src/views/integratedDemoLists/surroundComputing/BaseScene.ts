import {
    ACESFilmicToneMapping, Clock,
    DoubleSide, MathUtils,
    Mesh,
    MeshLambertMaterial,
    PlaneGeometry,
    SpotLight, Vector3
} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import * as THREE from "three";
import clarens_night_02_4k from "@/assets/hdr/clarens_night_02_4k.hdr?url";

export class BaseScene extends BaseInit {

    locked=false
    theta=0;

    phi=MathUtils.degToRad(45);
    radius=0;

    tPhi=0;
    tTheta=0;

    //本次应该偏移的数值
    mData={x:0,y:0};
    //上次使用的数值
    cData={x:0,y:0};

    debugData={
        phi:0,
        radius:50,
        sensitivity:10,
        useLerp:false,
        alpha:0.4
    };

    c:Clock=new Clock()

    constructor() {
        super({
            needLight:false,
            needOrbitControls:false,
            needAxesHelper:true,
            renderDomId:"#renderDom"
        } as BaseInitParams);

        this.lock()
        this.initDebug();

        this.init();

        this.addPlan();

        this.addLight();

        this.addDebug();

        this.loadEnv()
        this.animate()
    }
    addDebug(){
        this.dat.add(this.debugData,"radius",20,190).name("半径")
        this.dat.add(this.debugData,"sensitivity",2,50).name("灵敏度")
        this.dat.add(this.debugData,"useLerp").name("插帧")
        this.dat.add(this.debugData,"alpha").name("alpha")

    }
    loadEnv(){
        new RGBELoader().load(clarens_night_02_4k, (texture) => {
            console.log("纹理对象", texture);

            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.encoding = THREE.sRGBEncoding;
            this.envMap=texture
            this.scene.environment = texture;
            this.scene.background = texture;

        });
    }

    /**
     *
     * @param p
     * @param radius      半径R
     * @param theta       水平方向的方位角-本次偏移量 单位度数
     * @param phi         竖着的仰角-本次偏移量 单位度数
     */
    sphericalToCartesian(theta:number, phi:number) {


        // 将角度转换为弧度
        let thetaRad =MathUtils.degToRad(theta);
        let phiRad = MathUtils.degToRad(phi);
        //本次实际要使用的数值
        let cTheta=0;
        let cPhi=0;


        /**
         * 在当前方位角的基础上，需要受到变量影响
         * 至于是加是减，决定了方位角大的开口向那个方向变大或变小
         */
        cTheta=this.theta-thetaRad
        /**
         * 确保 theta 在 [0, 2π] 范围内
         */
        cTheta%=Math.PI*2;


        //限制仰角
        cPhi=this.phi+phiRad
        let max=MathUtils.degToRad(60);

        if(cPhi>max){
            cPhi=max
        }
        if(cPhi<-max){
            cPhi=-max
        }

        this.tPhi=cPhi
        this.tTheta=cTheta

    }

    /**
     * 设置相机初始位置
     * @param t 方位角
     * @param p 俯仰角
     */
    setInitPosition(t,p){

        this.theta=t;
        this.phi=p

        // 计算笛卡尔坐标
        var x = this.debugData.radius * Math.sin(t) * Math.cos(p);
        var y = this.debugData.radius * Math.sin(p);
        var z = this.debugData.radius * Math.cos(t) * Math.cos(p);

        this.camera.position.copy(new Vector3(x,y,z))

    }
    lock(){


        let dom=document.querySelector("#renderDom")!;

        dom.addEventListener("click",(e)=>{
            dom.requestPointerLock()
            // this.locked=true
        },false)
        dom.addEventListener("mousemove",(a)=>{
            let e=a as MouseEvent;
            if(this.locked){
                //x向右是正数，向左是负数
                //y向下是正数，向上是负数
                let s=this.debugData.sensitivity;
                let m={x:e.movementX/s,y:e.movementY/s}
                // let center=new Vector3(0,0,0)

                this.sphericalToCartesian(m.x,m.y);
            }
        })

        document.addEventListener("pointerlockchange",(e)=>{
            if (document.pointerLockElement) {
                this.locked=true
                // 鼠标已锁定
                console.log("鼠标已锁定", document.pointerLockElement);
            } else {
                this.locked=false
                // 鼠标已解锁
                console.log("鼠标已解锁");
            }
        })

    }
    addPlan(){

        const geometry = new PlaneGeometry(40, 40);
        const material = new MeshLambertMaterial({color: 0x222222});
        material.side=DoubleSide
        const plane = new Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true
        plane.rotateX(Math.PI/2)
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

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
        this.renderer.shadowMap.enabled = true;

        this.radius=this.debugData.radius
        let a=MathUtils.degToRad(45);
        this.setInitPosition(a,a)
        this.camera.lookAt(new Vector3(0,0,0));

    }
    /**
     * 根据俯仰角直接设置相机位置
     * @param p 围绕的中心点
     */
    updateCameraPosition(p:Vector3){
        let rad=MathUtils.lerp(this.radius,this.debugData.radius,0.1)

        this.phi=MathUtils.lerp(this.phi,this.tPhi,this.debugData.alpha)
        this.theta=MathUtils.lerp(this.theta,this.tTheta,this.debugData.alpha)
        // 计算笛卡尔坐标
        let x = p.x + rad * Math.sin(this.theta) * Math.cos(this.phi);
        let y = p.y + rad * Math.sin(this.phi);
        let z = p.z + rad * Math.cos(this.theta) * Math.cos(this.phi);
        this.camera.position.copy(new Vector3(x,y,z))
        this.radius=rad;
    }
    animate(){
        let m=this.mData;

        //相机锁定，并且有移动
        // if(this.locked && (m.x||m.y)){
        // }
        let center=new Vector3(0,0,0)

        this.updateCameraPosition(center);
        this.camera.lookAt(center);

        // if(this.locked){
        //     // 对 mData 进行插值，使其逐渐趋近于 0
        //     this.mData.x = MathUtils.lerp(this.mData.x, 0, this.debugData.alpha);
        //     this.mData.y = MathUtils.lerp(this.mData.y, 0, this.debugData.alpha);
        //
        //     let center = new Vector3(0, 0, 0);
        //     let targetPosition = this.sphericalToCartesian(center, this.debugData.radius, this.mData.x, this.mData.y);
        //
        //     // 更新相机位置
        //     this.camera.position.copy(targetPosition);
        //     this.camera.lookAt(center);
        // }

        this.stats.update()
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }
}