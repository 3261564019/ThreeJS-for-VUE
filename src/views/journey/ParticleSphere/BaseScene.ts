import {
    ACESFilmicToneMapping, AdditiveBlending, BufferGeometry, Color,
    DoubleSide, Float32BufferAttribute,
    Mesh,
    MeshLambertMaterial,
    PlaneGeometry, Points, ShaderMaterial, SphereGeometry,
    SpotLight, Uniform
} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";
import fragment from "./fragment.glsl"
import gsap from 'gsap';
import vertex from "./vertex.glsl"
import p from "@/assets/model/ParticleMesh/particle.glb?url"
import {color} from "echarts";
export class BaseScene extends BaseInit {


    animating=false;
    colors={
        colorA:"#d69a3c",
        colorB:"#6000ff",
    }
    points:Points;

    pointsArr:Float32BufferAttribute[]=[];
    material:ShaderMaterial;
    rage:0;
    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            needAxesHelper:false,
            adjustScreenSize:true,

            needGLTFLoader:true,
            transparentRenderBg:true,
            renderDomId:"#renderDom"
        } as BaseInitParams);

        super.initDebug();

        this.init();

        this.control.autoRotate=true;
        this.control.autoRotateSpeed=0.4;

        this.loadModel();
        // this.addBall();

        this.addLight();

        this.animate()
    }
    showGeometryByPoints(i){
        let geometry=new BufferGeometry()
        geometry.setAttribute("position", this.pointsArr[i])

        console.log("this",this)
        this.material=new ShaderMaterial({
            vertexShader:vertex,
            fragmentShader:fragment,
            uniforms:{
                uResolution: new Uniform(this.screenSize),
                uRage:{value:new Color(this.rage)},
                uColorA:{value:new Color(this.colors.colorA)},
                uColorB:{value:new Color(this.colors.colorB)},
            },
            transparent:true,
            depthTest:true,
            depthWrite: false,     // 禁止透明部分写入深度缓冲区
            blending:AdditiveBlending
        })
        let points=new Points(geometry,this.material);
        this.points=points
        this.scene.add(points);
    }
    addChangeEvent(){
        let run=()=>{
            this.animating=true
            this.rage=0;
            this.material.uniforms.uRage.value=0;
            gsap.to(this,{rage:1,duration:5,ease:"power1.inOut",onUpdate:()=>{
                    this.material.uniforms.uRage.value=this.rage
            },
                onComplete: () => {
                    console.log("动画结束了！");
                    this.animating=false
                    // 在此处执行动画结束后的操作
                }
            })
        }
        let a={
            a1:()=>{
                if(this.animating)return
                this.points.geometry.setAttribute("position",this.pointsArr[0]);
                this.points.geometry.setAttribute("aTargetPosition",this.pointsArr[1]);
                run()
            },
            a2:()=>{
                if(this.animating)return

                this.points.geometry.setAttribute("position",this.pointsArr[1]);
                this.points.geometry.setAttribute("aTargetPosition",this.pointsArr[2]);
                run()
            },
            a3:()=>{
                if(this.animating)return

                this.points.geometry.setAttribute("position",this.pointsArr[2]);
                this.points.geometry.setAttribute("aTargetPosition",this.pointsArr[0]);
                run()
            }
        }
        this.dat.add(a,"a1").name("球体to文字")
        this.dat.add(a,"a2").name("文字to猴头")
        this.dat.add(a,"a3").name("猴头to球体")


        this.dat.addColor(this.colors,"colorA").name("颜色A").onChange(
            ()=>{
                this.material.uniforms.uColorA.value.set(this.colors.colorA);
            }
        )

        this.dat.addColor(this.colors,"colorB").name("颜色B").onChange(
            ()=>{
                this.material.uniforms.uColorB.value.set(this.colors.colorB);
            }
        )


    }
    addPointsByGeometry(i:number){

        let geometry=new BufferGeometry()
        geometry.setAttribute("position", this.pointsArr[i])
        geometry.setAttribute("aTargetPosition", this.pointsArr[2])
        geometry.setIndex(null)

        this.material=new ShaderMaterial({
             vertexShader:vertex,
             fragmentShader:fragment,
             uniforms:{
                 uResolution: new Uniform(this.screenSize),
                 uRage:new Uniform(this.rage),
             },
             transparent:true,
             depthTest:true,
             depthWrite: false,     // 禁止透明部分写入深度缓冲区
             // blending:AdditiveBlending
         })
        // const geometry = new PlaneGeometry(30, 30,148,148);



        let points=new Points(geometry,this.material);

        this.dat.add(this,"toAnimate").name("动画");

         this.scene.add(points);
         // this.scene.add(new Mesh(geometry,material))

    }
    toAnimate(){
        gsap.to(this,{rage:1,duration:5,ease:"power1.inOut",onUpdate:()=>{
            this.material.uniforms.uRage.value=this.rage
        }})
        console.log("aaa")
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
        this.camera.position.set(0, 2, 3);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

    }
    animate(){

        this.control.update()
        this.stats.update()
        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }

    private loadModel() {
        this.gltfLoader.load(p,(e)=>{
            console.log(e.scene.children)

            let max=0;

            let res:Float32BufferAttribute[]=[]

            let positions=e.scene.children.map(v=>{
                //@ts-ignore
                let t=v.geometry.attributes.position
                console.log(v.name+"顶点数量：\t"+t.count);
                if(t.count>max){
                    max=t.count;
                }
                return t
            })


            console.log(max)
            console.log(positions)

            //
            for (const position of positions) {
                //如果頂點数不够就在已有的定点列表随机出来进行重复
                const vertices = new Float32Array(max*3)
                position.array.forEach((v,i)=>{
                    vertices[i]=position.array[i]
                })
                if(position.count<max){
                    //相差的顶点数量
                    let t=(max-position.count);
                    console.log("差了"+(max-position.count));
                    //已有定点数
                    let endIndex=position.array.length;
                    //0 1 2
                    //3 4 5
                    //6 7 8
                    for (let i = 0; i < t; i++) {
                        let x=endIndex+(i*3)+0;
                        let y=endIndex+(i*3)+1;
                        let z=endIndex+(i*3)+2;

                        let random=Math.floor(position.count*Math.random())*3

                        vertices[x]=position.array[random];
                        vertices[y]=position.array[random+1];
                        vertices[z]=position.array[random+2];
                    }
                }else{

                }
                res.push(new Float32BufferAttribute(vertices,3))
            }

            this.pointsArr=res;
            //先让球体显示出来
            this.showGeometryByPoints(0);

            // 添加切换事件
            this.addChangeEvent();
        })
    }
}