import * as THREE from "three";
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import pic from "@/assets/img/panoramic/DJI_0684.jpg?url"
import {Power1} from "gsap";
import {Mesh, MeshBasicMaterial, SphereGeometry} from "three";
import gsap from 'gsap';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
export class BaseScene extends BaseInit {
    private ball: Mesh<SphereGeometry, MeshBasicMaterial>;
    constructor() {
        super({
            needLight:false,
            renderDomId:"#renderDom",
            needOrbitControls:true,
            needAxesHelper:true
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.addBall();

    }
    enterScene() {
        // 获取相机坐标
        let cameraLook = new THREE.Vector3();
        this.camera.getWorldDirection(cameraLook);

        /**
         * 相机初始化好以后的位置是 z:0 y:1200 视角在顶部
         * 需要将其移动到 y:0  z :1200的位置 并且始终看向原点
         */
        let t={
            fov:this.camera.fov,
            cz: 0,
            cy:this.camera.position.y,
            r:this.ball.rotation.y
        }

        console.log("相机位置",this.camera.position)

        let camera = this.camera;
        let ball = this.ball;

        let tween=gsap.to(t, {
            cy: 0,
            cz:1200,
            duration: 2.3,
            r:Math.PI+(Math.PI/2),
            ease:Power1.easeOut,
            onUpdate: ()=>{
                // 更新相机位置和视角大小
                camera.position.y = t.cy;
                camera.position.z = t.cz;
                // 旋转效果
                ball.rotation.y =t.r;
                // 更新看向位置
                // camera.lookAt(0,0,0);
            },
            onComplete: ()=> {
                tween.kill()
                this.control.enableRotate=true
                this.control.minPolarAngle = Math.PI/4;
                this.control.maxPolarAngle = Math.PI;
            }
        });

        this.dat.add(this.camera,"fov",-180,180,0.01).name("fov").onChange(()=>{
            this.camera.updateProjectionMatrix();
        })
    }
    enter(){
        let p={
            fov: 179.9,
            ars: 40,
            rot: 0,
        }
        let camera = this.camera;
        let ball = this.ball;

        let tween = gsap.to(p, {
            fov: 30,
            ars: 0,
            rot: Math.PI,
            duration: 2.3 ,
            ease: Power1.easeIn,
            onUpdate:()=>{
                // 视角由大到小
                camera.fov = p.fov;
                camera.updateProjectionMatrix();
                // 旋转
                ball.rotation.y = p.rot;
            },
            onComplete:()=>{
                tween.kill()
                // 旋转入场动画
                this.enterScene()
            }
        });
    }
    addBall(){
        // 初始化球体
        let geometry = new THREE.SphereGeometry(1200  , 90  , 90  );
        // let geometry = new THREE.BoxGeometry(1200  , 1200  , 1200  );
        geometry.scale(-1, 1, 1);
        let map=new THREE.TextureLoader().load(pic)
        map.minFilter = THREE.LinearFilter;
        map.encoding  = THREE.sRGBEncoding;
        // 创建材质并设置全景图
        // let material = new THREE.MeshBasicMaterial({
        //     map,
        //     // color:"#F00",
        //     reflectivity: 1,
        //     lightMapIntensity:10,
        //     wireframe: false
        // });

        const material = new THREE.ShaderMaterial({
            uniforms: {
                map: { value: map },
                exposure: { value:3.5 } // 调整亮度的值，可以根据需求调整
            },
            vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
            fragmentShader: `
             uniform sampler2D map;
            uniform float exposure;
            varying vec2 vUv;
            void main() {
                vec4 texel = texture2D(map, vUv);
                texel.xyz = 1.0 - exp(-exposure * texel.xyz); // 调整曝光
                gl_FragColor = texel;
            }
        `
        });


        // 全景图贴在球体上
        this.ball = new THREE.Mesh(geometry, material);
        // this.ball.rotation.y=-Math.PI/2

        this.dat.add(this.ball.rotation,"x",-6,6,0.01).name("x")
        this.dat.add(this.ball.rotation,"y",-6,6,0.01).name("y")
        this.dat.add(this.ball.rotation,"z",-6,6,0.01).name("z")

        // mesh.scale.set(4,4,4)
        this.ball.position.set(0,2,0)
        // 添加到场景
        this.scene.add(this.ball);

        //贴图加载完了，才开始渲染并播放进场动画
        this.animate()

        this.enter()
    }
    init() {
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.9;
        this.renderer.outputEncoding = THREE.LinearEncoding;
        this.renderer.shadowMap.enabled = true;
        this.dat.close()
        this.camera=new THREE.PerspectiveCamera(170, window.innerWidth / window.innerHeight, 0.1, 10000);
        // //定位相机指向场景中心
        this.camera.position.set(0,  1200, 0);
        this.camera.lookAt(0,0,0)
        this.control = new OrbitControls(this.camera, this.renderer.domElement);
        this.control.rotateSpeed = -0.4;
        this.control.minDistance=260
        this.control.maxDistance=2600
        //图片没加载完之前不允许旋转
        this.control.enableRotate=false
        this.control.enablePan=false
        this.dat.add(this.control,"minDistance",-500,500,0.01).name("minDistance")
        this.dat.add(this.control,"maxDistance",-500,3000,0.01).name("maxDistance")
        this.dat.add(this.renderer,"toneMappingExposure",-2,2,0.01).name("曝光")
        this.control.enableDamping=true
    }
    animate(){
        this.stats.update()
        this.control.update()
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }
}