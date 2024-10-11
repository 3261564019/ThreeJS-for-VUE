import {
    ACESFilmicToneMapping,
    DoubleSide, MathUtils,
    Mesh,
    MeshLambertMaterial,
    PlaneGeometry, SphereGeometry, Spherical,
    SpotLight, Vector3
} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
function interpolateTheta(thetaStart: number, thetaEnd: number, t: number): number {
    // 确保角度在 [0, 360) 范围内
    thetaStart = (thetaStart + 360) % 360;
    thetaEnd = (thetaEnd + 360) % 360;

    // 计算角度差
    let deltaTheta = thetaEnd - thetaStart;

    // 如果差值大于180度，选择更短的插值路径，跨越0°
    if (deltaTheta > 180) {
        deltaTheta -= 360; // 选择负方向跨越
    } else if (deltaTheta < -180) {
        deltaTheta += 360; // 选择正方向跨越
    }

    // 插值并返回最终的theta，确保角度在 [0, 360) 范围内
    return (thetaStart + deltaTheta * t + 360) % 360;
}


function sphericalMotion(
    start: Vector3,
    end: Vector3,
    center: Vector3,
    t: number,
    radius: number
): Vector3 {
    // 计算起始点和结束点相对于中心点的偏移量
    let offsetStart = new Vector3(start.x - center.x, start.y - center.y, start.z - center.z);
    let offsetEnd = new Vector3(end.x - center.x, end.y - center.y, end.z - center.z);

    console.log("起始点",offsetStart)
    console.log("结束点",offsetEnd)

    // 计算起始和结束点的球面坐标
    const sphericalStart = new Spherical().setFromCartesianCoords(offsetStart.x, offsetStart.y, offsetStart.z);
    const sphericalEnd = new Spherical().setFromCartesianCoords(offsetEnd.x, offsetEnd.y, offsetEnd.z);

    /**
     * 目的是将开始和结束点转成球坐标系，并计算出球面坐标之间的插值
     * 将插值的位置转为笛卡尔坐标并返回
     */
    function mapToNegativeRange(angle:number) {
        if (angle >= 180 && angle <= 360) {
            return angle - 360; // 将 180-360 映射到 -180 到 0
        }
        return angle; // 保持 0-180 不变
    }
    //将开始和结束的Theta 从0-180转为0-360
    let startTheta=(sphericalStart.theta + 2 * Math.PI) % (2 * Math.PI)
    let endTheta=(sphericalEnd.theta + 2 * Math.PI) % (2 * Math.PI)
    //新的Theta还是位于0-360之间
    let lerpTheta=interpolateTheta(startTheta,endTheta,t)
    //将新的lerpTheta转回0-180
    lerpTheta=mapToNegativeRange(lerpTheta)

    // 打印调试信息
    // console.log("起始点球面坐标", MathUtils.radToDeg(sphericalStart.phi), MathUtils.radToDeg(sphericalStart.theta));
    // console.log("结束点球面坐标", MathUtils.radToDeg(sphericalEnd.phi), MathUtils.radToDeg(sphericalEnd.theta));

    // 确保 theta 和 phi 在 [0, 2π] 范围内
    // sphericalStart.theta = (sphericalStart.theta + 2 * Math.PI) % (2 * Math.PI);
    // sphericalEnd.theta = (sphericalEnd.theta + 2 * Math.PI) % (2 * Math.PI);

    // 修正插值逻辑，使 theta 能够沿预期路径旋转
    // let deltaTheta = sphericalEnd.theta - sphericalStart.theta;
    // if (deltaTheta > Math.PI) {
    //     deltaTheta -= 2 * Math.PI; // 选择最短旋转方向
    // } else if (deltaTheta < -Math.PI) {
    //     deltaTheta += 2 * Math.PI;
    // }


    // 插值
    const interpolatedPhi = MathUtils.lerp(sphericalStart.phi, sphericalEnd.phi, t);

    const interpolatedTheta =lerpTheta

    console.log(MathUtils.radToDeg(interpolatedTheta));

    // 根据插值结果计算新的笛卡尔坐标
    const x = center.x + radius * Math.sin(interpolatedPhi) * Math.cos(interpolatedTheta);
    const y = center.y + radius * Math.cos(interpolatedPhi);
    const z = center.z + radius * Math.sin(interpolatedPhi) * Math.sin(interpolatedTheta);



    return new Vector3(x, y, z);
}

function cartesianToSpherical(position: Vector3, target: Vector3): { theta: number, phi: number } {
    // 计算相对目标的偏移量
    const dx = position.x - target.x;
    const dy = position.y - target.y;
    const dz = position.z - target.z;

    // 计算俯仰角 phi (0 ~ 180)
    const phi = Math.atan2(Math.sqrt(dx * dx + dz * dz), dy) * (180 / Math.PI);

    // 计算水平角 theta (0 ~ 360)
    let theta = Math.atan2(dz, dx) * (180 / Math.PI);

    // 将theta旋转90度，并反向映射
    theta = (theta + 90) % 360;

    // 将映射的角度进行180度对称转换，确保符合预期
    if (theta <= 180) {
        theta = 180 - theta;
    } else {
        theta = 540 - theta; // 360 + (180 - theta)
    }

    return {
        theta,
        phi
    };
}



export class BaseScene extends BaseInit {

    debugData={
        lerp:0,
        theta:0
    }

    start=new Vector3(0,0,5)
    end=new Vector3(0,0,-5)
    current=new Vector3(0,0,5)


    ball:Mesh;

    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            needAxesHelper:true,
            renderDomId:"#renderDom"
        } as BaseInitParams);

        this.initDebug();

        this.init();


        // console.log("起始点球面坐标",MathUtils.radToDeg(a.phi),MathUtils.radToDeg(a.theta));

        this.revert();



        // this.addPlan();

        this.addLight();

        this.addDebug();

        this.addBall();

        this.animate()
    }
    revert(){
        let spherical=new Spherical(5,MathUtils.degToRad(90),MathUtils.degToRad(125));
        // 根据 Spherical 对象计算笛卡尔坐标
        const x = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
        const y = spherical.radius * Math.cos(spherical.phi);
        const z = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);

        this.current=new Vector3(x,y,z);

        let t={
            "x":x,
            "y":y,
            "z":z
        }
        // console.log("位置",this.current)

        const sphericalEnd = new Spherical().setFromCartesianCoords(
            -5,
            0,
            0
        );
        // 确保 theta 在 [0, 2π) 范围内
        // sphericalEnd.theta = (sphericalEnd.theta + 2 * Math.PI) % (2 * Math.PI);

        // if(sphericalEnd.theta>Math.PI){
        //     sphericalEnd.theta-=Math.PI/2

        // }

        let reverted=(sphericalEnd.theta + 2 * Math.PI) % (2 * Math.PI);

        console.log("ggga",MathUtils.radToDeg(sphericalEnd.phi),MathUtils.radToDeg(reverted));
    }
    addDebug(){
        this.dat.add(this.debugData,"lerp",0,1,0.01).onChange(()=>{
            // this.current.copy(sphericalMotion(this.start,this.end,new Vector3(0,0,0),this.debugData.lerp,5))


        })

        this.dat.add(this.debugData,"theta",0,360,0.01).onChange(()=> {
            let targetPosition=new Vector3()
            let target=new Vector3(0,0,0)
            let phi=MathUtils.degToRad(90)
            let radius=5;
            targetPosition.x =
                target.x + radius * Math.sin((this.debugData.theta * Math.PI) / 180) * Math.cos((phi * Math.PI) / 180);
            targetPosition.z =
                target.z + radius * Math.cos((this.debugData.theta * Math.PI) / 180) * Math.cos((phi * Math.PI) / 180);
            this.current.copy(targetPosition);
        })

        console.log("aaa :",cartesianToSpherical(new Vector3(5,4,0),new Vector3(0,0,0)));

    }
    addBall(){
        const geometry = new SphereGeometry(0.5, 40);
        const material = new MeshLambertMaterial({color: 0x222222});
        this.ball=new Mesh(geometry, material);
        this.scene.add(this.ball);
    }
    addPlan(){

        const geometry = new PlaneGeometry(40, 40);
        const material = new MeshLambertMaterial({color: 0x222222});
        material.side=DoubleSide
        const plane = new Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true

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
        this.control.enableDamping=true;
        this.control.dampingFactor = 0.08;
        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(10, 40, 10);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

    }
    animate(){

        this.ball.position.copy(this.current)

        this.control.update()
        this.stats.update()
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }
}