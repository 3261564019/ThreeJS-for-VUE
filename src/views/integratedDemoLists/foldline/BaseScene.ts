import {
    ACESFilmicToneMapping, AxesHelper, Clock, Color,
    DoubleSide, Line, LineBasicMaterial,
    Mesh,
    MeshLambertMaterial,
    PlaneGeometry,
    SpotLight, Vector3
} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import {THREE} from "enable3d";



// 计算两点之间的距离
function distance(p1: THREE.Vector3, p2: THREE.Vector3): number {
    return Math.sqrt(
        Math.pow(p2.x - p1.x, 2) +
        Math.pow(p2.y - p1.y, 2) +
        Math.pow(p2.z - p1.z, 2)
    );
}


// 函数：获取指定进度的点位和切线向量
function getPointAndTangentAtProgress(pointsArray: THREE.Vector3[], t: number): { point: THREE.Vector3, tangent: THREE.Vector3 } {
    // 计算每段折线的长度
    let segmentLengths: number[] = [];
    let totalLength = 0;

    for (let i = 0; i < pointsArray.length - 1; i++) {
        let segmentLength = distance(pointsArray[i], pointsArray[i + 1]);
        segmentLengths.push(segmentLength);
        totalLength += segmentLength;
    }

    // 目标位置的总长度
    let targetLength = t * totalLength;

    // 找到目标长度所在的段
    let accumulatedLength = 0;
    for (let i = 0; i < segmentLengths.length; i++) {
        if (accumulatedLength + segmentLengths[i] >= targetLength) {
            let segmentStart = pointsArray[i];
            let segmentEnd = pointsArray[i + 1];
            let segmentT = (targetLength - accumulatedLength) / segmentLengths[i];

            // 线性插值计算该段中的点
            let pointAtT = new THREE.Vector3(
                segmentStart.x + segmentT * (segmentEnd.x - segmentStart.x),
                segmentStart.y + segmentT * (segmentEnd.y - segmentStart.y),
                segmentStart.z + segmentT * (segmentEnd.z - segmentStart.z)
            );

            // 计算切线向量
            let tangentAtT = new THREE.Vector3(
                segmentEnd.x - segmentStart.x,
                segmentEnd.y - segmentStart.y,
                segmentEnd.z - segmentStart.z
            ).normalize();

            return { point: pointAtT, tangent: tangentAtT };
        }
        accumulatedLength += segmentLengths[i];
    }

    // 如果 t 为 1，返回最后一个点及其切线向量
    const lastSegmentStart = pointsArray[pointsArray.length - 2];
    const lastSegmentEnd = pointsArray[pointsArray.length - 1];
    const lastTangent = new THREE.Vector3(
        lastSegmentEnd.x - lastSegmentStart.x,
        lastSegmentEnd.y - lastSegmentStart.y,
        lastSegmentEnd.z - lastSegmentStart.z
    ).normalize();

    return {
        point: new THREE.Vector3(
            pointsArray[pointsArray.length - 1].x,
            pointsArray[pointsArray.length - 1].y,
            pointsArray[pointsArray.length - 1].z
        ),
        tangent: lastTangent
    };
}

export class BaseScene extends BaseInit {

    private points = [
        new Vector3(-10, 0, 10),
        new Vector3(-5, 5, 5),
        new Vector3(0, 0, 0),
        new Vector3(5, -5, 5),
        new Vector3(10, 0, 10)
    ];

    box:Mesh;

    constructor() {
        super({
            needLight: false,
            needOrbitControls: true,
            needAxesHelper: true,
            renderDomId: "#renderDom"
        } as BaseInitParams);

        this.initDebug();

        this.init();
        this.addTestBox()
        this.addPlan();

        this.addLight();
        this.addLine()

        this.animate()
    }

    addTestBox(){
        const sphere = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.3, 1),
            new THREE.MeshBasicMaterial({color:new Color("#f00")})
        );
        sphere.add(new AxesHelper(3))
        // sphere.castShadow = true
        this.box=sphere;
        this.scene.add(sphere);
    }

    addLine() {
        // 点位数组

        // 创建几何体
        const geometry = new THREE.BufferGeometry().setFromPoints(this.points);
        // 创建材质
        const material = new LineBasicMaterial({color: 0x0000ff});

        // 创建折线对象
        const line = new Line(geometry, material);

        // 将折线添加到场景中
        this.scene.add(line);
    }

    addPlan() {

        const geometry = new PlaneGeometry(40, 40);
        const material = new MeshLambertMaterial({color: 0x222222});
        material.side = DoubleSide
        const plane = new Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true

        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        //添加地板容器
        this.scene.add(plane);

    }

    addLight() {

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
        this.control.enableDamping = true;
        this.control.dampingFactor = 0.08;
        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 0, 60);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

        this.clock=new Clock();
    }

    animate() {

        let t=this.clock.getElapsedTime()/10;
        let {point,tangent}=getPointAndTangentAtProgress(this.points,t)
        this.box.position.copy(point);
        this.box.lookAt(tangent.add(point));
        // console.log(t)
        this.control.update()
        this.stats.update()
        this.renderer.render(this.scene, this.camera);
        this.raf = requestAnimationFrame(this.animate.bind(this));
    }
}