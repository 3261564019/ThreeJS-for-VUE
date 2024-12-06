import {
    ACESFilmicToneMapping, AdditiveBlending, AxesHelper, BufferGeometry,
    DoubleSide, Float32BufferAttribute,
    Mesh,
    MeshLambertMaterial, Object3DEventMap,
    PlaneGeometry, Points, Raycaster, ShaderMaterial,
    SpotLight, Uniform, Vector2
} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import frag from "./frag.glsl"
import vertex from "./vertex.glsl"
import dog from "@/assets/img/dog.webp"
import {CanvasDraw} from "@/views/journey/ParticlesCursor/CanvasDraw";
export class BaseScene extends BaseInit {

    private ray=new Raycaster();
    private plane: Mesh<PlaneGeometry, MeshLambertMaterial, Object3DEventMap>;

    private cd:CanvasDraw;
    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            needAxesHelper:false,
            transparentRenderBg:true,
            needTextureLoader:true,
            calcCursorPosition:true,
            adjustScreenSize:true,
            renderDomId:"#renderDom"
        } as BaseInitParams);

        this.cd=new CanvasDraw();

        this.initDebug();

        this.init();

        this.addPlan();
        this.addParticles();

        this.animate()
    }
    addPlan(){
        const planeGeometry = new PlaneGeometry(40, 40);
        const planeMaterial = new MeshLambertMaterial({
            color:"#f00"
        });
        const plane = new Mesh(planeGeometry, planeMaterial);
        // plane.rotation.x = Math.PI /
        this.plane=plane;
        this.scene.add(plane);
    }
    addParticles(){

        const geometry = new PlaneGeometry(40, 40,148,148);


        let points_m=new ShaderMaterial({
            vertexShader:vertex,
            fragmentShader:frag,
            uniforms: {
                uSize: new Uniform(1),
                uT1:{value:this.textureLoader.load(dog)},
                uResolution: new Uniform(this.screenSize),
            },

            depthTest:true,
            depthWrite: false,     // 禁止透明部分写入深度缓冲区
            // blending:AdditiveBlending,
            transparent:true
        });


        let points=new Points(geometry,points_m);

        //添加地板容器
        this.scene.add(points);

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

        this.scene.add(new AxesHelper(10));

        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.9;
        this.control.enableDamping=true;
        this.control.dampingFactor = 0.08;
        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 0, 45);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

        // setInterval(()=>{
        //     console.log("aa",this.cursorPosition)
        // },1000)
    }
    animate(){

        this.rayCasteTest()
        this.control.update()
        this.stats.update()
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }

    rayCasteTest() {

        let t=this.cursorPosition;
        // console.log("this.cursorPosition",this);
        if(t){

            let pointer=new Vector2();
            pointer.x = ( t.x / window.innerWidth ) * 2 - 1;
            pointer.y = - ( t.y / window.innerHeight ) * 2 + 1;
            this.ray.setFromCamera( pointer, this.camera );

            const intersects = this.ray.intersectObject(this.plane);

            if ( intersects.length > 0 ) {
                let t=intersects[0]

                console.log(t.uv)
                this.cd?.draw(t.uv)
            }
        }

    }
}