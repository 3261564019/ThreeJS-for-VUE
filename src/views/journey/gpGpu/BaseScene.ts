import {
    ACESFilmicToneMapping, AdditiveBlending, BufferAttribute, BufferGeometry, Color,
    DoubleSide,
    Mesh, MeshBasicMaterial,
    MeshLambertMaterial, NormalBufferAttributes, Object3DEventMap, Plane,
    PlaneGeometry, Points, ShaderMaterial, SphereGeometry,
    SpotLight, Uniform
} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";
import {GPUComputationRenderer, Variable} from "three/examples/jsm/misc/GPUComputationRenderer";
import gpgpuShader from "./gpgpu/particles.glsl";

export class BaseScene extends BaseInit {
    private material: ShaderMaterial;
    private points: Points<BufferGeometry<NormalBufferAttributes>, ShaderMaterial, Object3DEventMap>;
    private computation: GPUComputationRenderer;
    private variable: Variable;
    //实际用于构造points的Geometry
    private geometry=new BufferGeometry();
    //球体的geometry
    private baseGeometry: SphereGeometry;
    //gpgpu的大小 size*size
    private size: number;
     

    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            needAxesHelper:true,
            transparentRenderBg:true,
            adjustScreenSize:true,
            renderDomId:"#renderDom"
        } as BaseInitParams);

        this.initDebug();

        this.init();


        this.initGpGup()
        this.addGpGupDebug();
        this.addBall();

        this.addLight();

        this.animate()
    }
    initGpGup(){
        // GPUComputationRenderer
        //如果有9个粒子需要9个像素，那么就是3*3的图像，每个像素有rgb分别对应其xyz
        //如果是10，平方根约等于3.16，向上取整为4，即4*4的图像
        const geometry = new SphereGeometry(3, 32,32    );
        this.baseGeometry=geometry;
        let count=geometry.attributes.position.count
        let array=geometry.attributes.position.array;
        console.log(count);
        let size=Math.ceil(Math.sqrt(count));

        let computation=new GPUComputationRenderer(size,size,this.renderer);
        let dataTexture = computation.createTexture();
        console.log(size)
        //宽高是上面设置的宽高 data数组的长度是 宽*高*4
        //每四个元素对应一个颜色，分别是rgba
        console.log(dataTexture.image)
        //dataTexture会被注入到，gpgpuShader中，纹理的名字是uParticles
        let variable=computation.addVariable("uParticles",gpgpuShader,dataTexture)

        computation.setVariableDependencies(variable,[variable]);

        for(let i=0;i<count;i++){
            const i3=i*3;
            const i4=i*3;
            dataTexture.image.data[i4+0]=array[i3+0]
            dataTexture.image.data[i4+1]=array[i3+1]
            dataTexture.image.data[i4+2]=array[i3+2]
            dataTexture.image.data[i4+3]=0
        }

        computation.init()
        
        this.size=size;
        this.variable=variable;
        this.computation=computation;
    }
    addBall(){

        this.material=new ShaderMaterial({
            vertexShader:vertex,
            fragmentShader:fragment,
            uniforms:{
                uResolution: new Uniform(this.screenSize),
                uParticlesTexture:new Uniform()
            },
            transparent:true,
            depthTest:true,
            depthWrite: false,     // 禁止透明部分写入深度缓冲区
            blending:AdditiveBlending
        })
        let count=this.baseGeometry.attributes.position.count
        //setDrawRange 允许你在 BufferGeometry 中指定绘制的顶点范围，适用于减少渲染量和优化性能。
        // const t = new SphereGeometry(3, 32,32    );

        // this.geometry.setDrawRange(0,count);
        let points=new Points(this.geometry,this.material);
        // let points=new Points(t,this.material);
        // points.geometry.setIndex(null)

        const particlesUvArray=new Float32Array(count*2);
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                // particlesUvArray
                const i=(y*this.size+x)
                const i2=i*2;
                const uvx=(x+0.5)/this.size
                const uvy=(y+0.5)/this.size
                particlesUvArray[i2+0]=uvy;
                particlesUvArray[i2+1]=uvx;
            }
        }
        console.log(particlesUvArray)
        points.geometry.setDrawRange(0,this.baseGeometry.attributes.position.count);
        points.geometry.setAttribute("aParticlesUv",new BufferAttribute(particlesUvArray,2));


        this.points=points
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

        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.9;
        this.control.enableDamping=true;
        this.control.dampingFactor = 0.08;
        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 0, 60);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

    }
    animate(){

        this.control.update()
        this.stats.update()
        this.computation.compute()
        this.material.uniforms.uParticlesTexture.value=this.computation.getCurrentRenderTarget(this.variable).texture
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }

    private addGpGupDebug() {

        let map=this.computation.getCurrentRenderTarget(this.variable).texture;
        let plane=new Mesh(
            new PlaneGeometry(3, 3),
            new MeshBasicMaterial({map})
        );

        plane.position.x=3;

        this.scene.add(plane);
    }
}