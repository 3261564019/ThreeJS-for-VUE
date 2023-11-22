import * as THREE from "three";
import {Color, Mesh, MeshBasicMaterial, Texture, TextureLoader, Vector3} from "three";
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import house from "@/assets/img/house.png"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import my from "@/assets/model/111.gltf?url"
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import clarens_night_02_4k from "@/assets/hdr/clarens_night_02_4k.hdr?url";



export class ShaderBaseScene extends BaseInit {

    private picTexture:Texture

    constructor() {
        super({
            needLight: false,
            renderDomId: "#ShaderBaseScene",
            needOrbitControls: true,
            adjustScreenSize: true
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.addPlan();

        this.addLight();

        // this.addTriangle();

        // this.addPoints();

        // this.addBox();
        this.addBall();
        // this.addCube();
        this.addDebug();
        this.loadGltf();
        this.loadEnv()
    }
    loadEnv(){
        new RGBELoader().load(clarens_night_02_4k, (texture) => {
            console.log("纹理对象", texture);
            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.encoding = THREE.sRGBEncoding;
            this.scene.environment = texture;
            this.scene.background = texture;

            this.manualRender()
        });
    }
    loadGltf(){
        let loader =new GLTFLoader()
        loader.load(my,(e)=>{
            console.log("加载结果",e)

            e.scene.children.forEach(child =>{
                if(child.isMesh){
                    let m=child.material
                    if(m.name==="眼球"){
                        m.roughness=0
                        m.metalness=0
                        m.color=new Color("#222")
                        console.log("找到了",m)
                    }
                }
                // let m=child.material
                // if(child)
            })

            let s=e.scene
            s.scale.set(2,2,2)
            s.position.set(0,8,0)
            // 抽象为一个简易的物理盒子
            this.scene.add(s)
        })
    }
    addCube(){
        // 创建顶点缓冲区
        const vertices = new Float32Array([
            // 前面（顺时针）
            -1, 1, 1,    // v0
            -1, -1, 1,   // v1
            1, -1, 1,    // v2
            1, 1, 1,     // v3

            // 后面（顺时针）
            -1, 1, -1,   // v4
            -1, -1, -1,  // v5
            1, -1, -1,   // v6
            1, 1, -1     // v7
        ]);

        const positionBuffer = new THREE.BufferAttribute(vertices, 3);

// 创建面（索引）缓冲区
        const indices = new Uint16Array([
            // 前面
            0, 1, 2,    // 第一个三角形
            2, 3, 0,    // 第二个三角形

            // 后面
            4, 6, 5,    // 第三个三角形
            4, 7, 6,    // 第四个三角形

            // 左侧
            4, 5, 1,    // 第五个三角形
            4, 1, 0,    // 第六个三角形

            // 右侧
            3, 2, 6,    // 第七个三角形
            3, 6, 7,    // 第八个三角形

            // 顶部
            0, 3, 7,    // 第九个三角形
            0, 7, 4,    // 第十个三角形

            // 底部
            1, 5, 6,    // 第十一个三角形
            1, 6, 2     // 第十二个三角形
        ]);

        const indexBuffer = new THREE.BufferAttribute(indices, 1);

// 创建 BufferGeometry 对象并设置顶点和面信息
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', positionBuffer);
        geometry.setIndex(indexBuffer);

// 创建网格对象并应用材质
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const mesh = new THREE.Mesh(geometry, material);

// 将网格对象添加到场景中进行渲染
        this.scene.add(mesh);
    }
    addDebug() {


        const params = {
            toneMapping: 'ACESFilmicToneMapping',
            exposure: 0.9,
            encoding: 'Linear',
            gamma:2,
            //是否启用正确的光照计算
            physicallyCorrectLights:false
        };
        let tons=["NoToneMapping ",'LinearToneMapping ',"ReinhardToneMapping",'CineonToneMapping',"ACESFilmicToneMapping","CustomToneMapping"]
        this.dat.add(params, 'toneMapping',tons).onChange((value:string)=>{
            // 根据选择的色调映射算法更新渲染器属性
            // @ts-ignore
            this.renderer.toneMapping = THREE[value];
        });


        this.dat.add(params, 'exposure', 0, 3).step(0.1).onChange((value:number)=>{
            // 更新渲染器的曝光程度
            this.renderer.toneMappingExposure = value;
        });

        this.dat.add(params, 'gamma', 0, 10).step(0.1).onChange((value:number)=>{
            // 更新渲染器的曝光程度
            this.renderer.gammaFactor = value;
        });

        this.dat.add(params,'physicallyCorrectLights').name("真实光照").onChange(
            e=>{
                console.log("ee",e)
                this.renderer.physicallyCorrectLights=!!e;
            }
        )

        // this.dat.add(this.renderer, 'gammaFactor', 0, 3).step(0.1).name('Gamma Factor');

        // this.renderer.set

        this.dat.add(params, 'encoding', ['sRGB', 'Linear']).onChange((value:string)=>{
            // 更新渲染器的输出编码方式
            if (value === 'sRGB') {
                this.renderer.outputEncoding = THREE.sRGBEncoding;
            } else if (value === 'Linear') {
                this.renderer.outputEncoding = THREE.LinearEncoding;
            }
        });


        this.renderer.outputEncoding=THREE.LinearEncoding;
        this.renderer.toneMappingExposure = 0.9;

    }
    addBall(){

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(3, 33, 33),
            new THREE.MeshLambertMaterial({color: "#f00"})
        );

        sphere.position.x = -15;
        sphere.position.y = 3;
        sphere.castShadow = true

        this.scene.add(sphere);
    }
    addPlan() {

        const geometry = new THREE.PlaneGeometry(40, 40);
        const material = new THREE.MeshLambertMaterial({color: 0xeeeeee});
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
        const light = new THREE.SpotLight("#fff",1);
        light.castShadow = true;            // default false
        light.position.x = 20;
        light.position.y = 30;

        // this.scene.add(light);


        const alight = new THREE.AmbientLight("#fff",0.7);
        alight.castShadow = true;            // default false
        this.scene.add(alight);

    }

    addTriangle() {

        let positions = new Float32Array([
            -10, 5, 0, // 0
            0, 15, 0, // 1
            10, 5, 0, // 2
            //所有的点重复一份 即显示两个三角形
            -10, 5, 10, // 3
            0, 15, 10, // 4
            10, 5, 10, // 5
        ]);
        let geometry = new THREE.BufferGeometry();

        geometry.attributes.position = new THREE.BufferAttribute(positions, 3);

        //先声明定点，在通过下标说明由哪些定点构成面，定点可以重复使用，可有效的提升性能

        let indexs = new Uint16Array([
            //指明positions中 下标为 0，3，4 坐标拼成三角形
            0, 3, 4,
            1, 2, 5,
            0, 3, 5,
            0, 2, 5
        ]);


        let colors = new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
            1, 1, 0,
            0, 1, 1,
            1, 0, 1
        ]);


        geometry.index = new THREE.BufferAttribute(indexs, 1);

        let mesh = new THREE.Mesh(
            geometry,
            new THREE.MeshBasicMaterial({
                // vertexColors: THREE.VertexColors,
                side: THREE.DoubleSide
            })
        );

        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));


        this.scene.add(mesh);
    }

    addPoints() {
        let positions = new Float32Array([
            -10, 5, 0, // 0
            0, 15, 0, // 1
            10, 5, 0, // 2
        ]);
        let geometry = new THREE.BufferGeometry();

        geometry.attributes.position = new THREE.BufferAttribute(positions, 3);

        let point = new THREE.Points(
            geometry,
            new THREE.PointsMaterial({
                color: 0x00ff00,
                size: 3
            })
        );
        this.scene.add(point);

    }

    addBox() {
        let positions = new Float32Array([
            -10, 0, 0,  // 左下
            -10, 10, 0, // 左上
            10, 10, 0,  // 右上
            10, 0, 0,   // 右下
        ]);
        let geometry = new THREE.BufferGeometry();
        let temp = 3
        geometry.attributes.position = new THREE.BufferAttribute(positions, temp);

        const uvs = [
            0, 0,   // 左下
            0, 1,   // 左上
            1, 1,   // 右上
            1, 0,   // 右下
        ];
        geometry.attributes.uv = new THREE.Float32BufferAttribute(uvs, 2)

        geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([
            //指明positions中 由下标为 0，1，2 坐标拼成左上角三角形
            0, 1, 2,
            //指明positions中 由下标为 0，2，3坐标拼成左上角三角形
            0, 2, 3
        ]), 1));

        let texture = new TextureLoader().load(house);
        // texture.flipY = false; // 关闭纵向翻转
        // texture.repeat.x=THREE.RepeatWrapping;
        texture.wrapS = THREE.RepeatWrapping // 水平重复平铺
        texture.wrapT = THREE.RepeatWrapping // 垂直重复平铺
        this.picTexture=texture;
        // texture.rotation=Math.PI * 0.5
        let material =
            new MeshBasicMaterial({
                side: THREE.DoubleSide,
                map: texture
            })
        material.wireframe = false

        let mesh = new Mesh(
            geometry,
            material
        );

        console.log(mesh);

        this.scene.add(mesh);
    }

    init() {

        this.renderer.shadowMap.enabled = true;

        this.camera.position.set(0, 5, 30);
        //定位相机指向场景中心
        this.camera.lookAt(new Vector3(0, 5, 0))

        const clock = new THREE.Clock();

        const animate = () => {

            this.stats.update()

            this.raf = requestAnimationFrame(animate);

            this.renderer.render(this.scene, this.camera);

            if(this.picTexture){
                // this.picTexture.offset.x=clock.getElapsedTime()
                this.picTexture.offset.set(-clock.getElapsedTime()/15,0)
            }
        }

        animate();

    }
}
