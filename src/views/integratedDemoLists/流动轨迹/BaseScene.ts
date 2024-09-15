import * as THREE from "three";
import {AxesHelper, Color, MathUtils, Mesh} from "three";
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import {RotationBoxScene} from "../高德地图/hooks/childScene/RotationBoxScene";
import {ShiningWall} from "../高德地图/hooks/childScene/ShiningWall";
import {ChildScene} from "../高德地图/types";


// 创建一个函数来生成小道几何并设置 UV 坐标
function createPathGeometry(curve, width, segments = 50) {
    // 获取曲线上的点
    const points = curve.getPoints(segments);
    const halfWidth = width / 2;

    const vertices = [];
    const indices = [];
    const uvs = [];

    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        let nextPoint;

        // 如果不是最后一个点，就获取下一个点来计算方向
        if (i < points.length - 1) {
            nextPoint = points[i + 1];
        } else {
            // 对于最后一个点，使用倒数第二个点来计算方向
            nextPoint = points[i - 1];
        }

        // 计算方向向量
        const tangent = new THREE.Vector3().subVectors(nextPoint, point).normalize();
        // 计算法向量 (朝上)
        const up = new THREE.Vector3(0, 1, 0);
        // 计算侧向量 (在平面上左侧的向量)
        const side = new THREE.Vector3().crossVectors(up, tangent).normalize();

        // 左侧和右侧的顶点
        const left = new THREE.Vector3().copy(point).addScaledVector(side, halfWidth);
        const right = new THREE.Vector3().copy(point).addScaledVector(side, -halfWidth);

        // 添加顶点
        vertices.push(left.x, left.y, left.z);
        vertices.push(right.x, right.y, right.z);

        // 计算曲线进度，用于 UV 映射
        const progress = i / (points.length - 1);
        // 添加 UV 坐标 (这里设置 u 为进度，v 为 0 和 1)
        uvs.push(progress, 0); // 左侧点的 UV
        uvs.push(progress, 1); // 右侧点的 UV

        // 创建面
        if (i < points.length - 1) {
            const baseIndex = i * 2;
            indices.push(baseIndex, baseIndex + 1, baseIndex + 2); // 第一个三角形
            indices.push(baseIndex + 1, baseIndex + 3, baseIndex + 2); // 第二个三角形
        }
    }

    // 创建几何体
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); // 设置 UV 坐标
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
}


export class CurvePath extends BaseInit {

    curve: THREE.CatmullRomCurve3
    splitLineArr: Mesh[] = []

    //子场景
    private childScene: ChildScene[]=[]
    constructor() {
        super({
            needLight: false,
            renderDomId: "#curve-path",
            needOrbitControls: true,
            needAxesHelper: true,
            adjustScreenSize:true
        } as BaseInitParams);

        this.initDebug();

        this.init();

        // this.addPlan();

        this.addLight();

        this.addLine();


        this.addBall();
        /*
            解决一开始经纬度转换（latLongToPosition）返回值为0的问题
         */
        // setTimeout(() =>{
        //     // this.childScene.push(new RotationBox(this.scene));
        //
        //     this.childScene.push(new ShiningWall({scene:this.scene,wallPath:[
        //             [-20,-20],
        //             [20,-20],
        //             [20,20],
        //             [-20,20],
        //             [-20,-20],
        //         ],color:"#FFD500",onlyThreeScene:true}))
        // },10)

    }
    addBall(){

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(3, 33, 33),
            new THREE.MeshLambertMaterial({color: "#fff"})
        );

        sphere.position.x = 10;
        sphere.position.y = 3;
        sphere.castShadow = true

        this.scene.add(sphere);
    }

    addPlan() {

        const geometry = new THREE.PlaneGeometry(40, 40);
        const material = new THREE.MeshLambertMaterial({color: 0x222222});
        material.side = THREE.DoubleSide
        const plane = new THREE.Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        //添加地板容器
        this.scene.add(plane);

    }

    addLight() {

        //创建聚光灯
        const light = new THREE.SpotLight("#fff");
        light.castShadow = true;            // default false
        light.position.x = 20;
        light.position.y = 30;

        this.scene.add(light);
    }

    addLine() {
        this.curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-20, 0, -20),
            new THREE.Vector3(4, 0, -7),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(20, 0, 20)
        ],false, 'catmullrom', 0.1)
        // this.curve.tension=0.8;


// 使用函数创建一个小道
        const pathWidth = 2; // 小道的宽度
        const pathGeometry = createPathGeometry(this.curve, pathWidth);
        const pathMaterial = new THREE.MeshBasicMaterial({ color: new Color("#cf645e"), side: THREE.DoubleSide });
        const pathMesh = new THREE.Mesh(pathGeometry, pathMaterial);

// 将生成的小道添加到场景中
        this.scene.add(pathMesh);

        //创建虚线的小结
        for (let i = 0; i < 30; i++) {

            const geometry = new  THREE.ConeGeometry( 0.3, 1, 3 );
            const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
            let splitLine = new THREE.Mesh(geometry, material);
            // splitLine.add(new AxesHelper(3))
            // splitLine.position.set(i*2,0,0)
            let t = splitLine.clone()
            t.rotation.x = 0.5 * Math.PI;

// 创建一个组，并将立方体添加到组中
            const group = new THREE.Group();
            group.add(t)
            // group.rotation.x = Math.PI / 4;
            this.splitLineArr.push(group)

            this.scene.add(group)


        }


    }

    init() {

        this.renderer.shadowMap.enabled = true;

        this.camera.position.set(0, 30, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

        const clock = new THREE.Clock();

        let round = 10;

        const animate = () => {

            let t = clock.getElapsedTime();
            // let percent = (t % round) / round
            // console.log("当前百分比",percent)


            this.stats.update()

            this.childScene.forEach(scene=>{
                scene.render(clock.getDelta(),clock.elapsedTime);
            })

            if (this.curve) {


                this.splitLineArr.forEach((v, index) => {
                    let at = (index / 30) + (t % 30) / 30
                    if (at > 1) {
                        at %= 1
                    }
                    let position = this.curve.getPointAt(at) as THREE.Vector3;

                    let tangent=this.curve.getTangentAt(at);
                    // console.log(tangent);
                    let lookAtVec=tangent.add(position);
                    v.lookAt(lookAtVec)
                    // @ts-ignore
                    v.position.set(...position)
                })
            }

            this.raf=requestAnimationFrame(animate);

            this.renderer.render(this.scene, this.camera);
        }

        animate();

    }
}
