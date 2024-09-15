import {
    ACESFilmicToneMapping, Clock, Color,
    DoubleSide,
    Mesh,
    MeshLambertMaterial,
    PlaneGeometry, Raycaster,
    SpotLight, Vector2
} from "three";
import {BaseInit, BaseInitParams} from "./baseInit";
import {FlowPath} from "@/views/integratedDemoLists/mapPath/FlowPath";
import * as THREE from "three";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import {bl1, bl2} from "@/views/integratedDemoLists/mapPath/pathData";

export class BaseScene extends BaseInit {

    pathScene:FlowPath[]=[]
    private clock: Clock;
    private transformControl: TransformControls;
    private raycaster: Raycaster;
    private sphere;

    private pointArr="";

    public savePoint:Function;


    constructor(savePoint:Function) {
        super({
            needLight:false,
            needOrbitControls:false,
            needAxesHelper:false,
            renderDomId:"#renderDom",
            transparentRenderBg:true
        } as BaseInitParams);

        this.raycaster=new Raycaster();
        
        this.initDebug();

        this.init();

        this.addDebug();
        // this.addPath()

        this.savePoint=savePoint
        this.review();

        this.animate()
        this.addDebugBox()
        this.initDragControls()
    }
    review(){
        let points=[]
        bl2.forEach((v,i)=>{
            points.push(new THREE.Vector3(v[0]*1,  v[1]*1,0))
        })

        // this.pathScene.push(new FlowPath(points,10,this,new Color("#37dfff")))
        this.pathScene.push(new FlowPath(points,5,this,new Color("#f08300")))

        let points1=[]
        bl1.forEach((v,i)=>{
            points1.push(new THREE.Vector3(v[0]*1,  v[1]*1,0))
        })

        // this.pathScene.push(new FlowPath(points,10,this,new Color("#37dfff")))
        this.pathScene.push(new FlowPath(points1,10,this,new Color("#f00")))

        // console.log(t)
    }
    addDebug(){

        let t={
            setPoint:()=>{
                let p=this.sphere.position;
                console.log(this)
                this.savePoint([p.x,p.y])
                localStorage.setItem("points",this.pointArr)
            }
        }


        this.dat.add(t,"setPoint").name("存储点位");
    }
    initDragControls(){

        //创建transformControl
        this.transformControl = new TransformControls( this.camera,this.renderer.domElement );
        //最小拖动步幅
        // this.transformControl.translationSnap=1;
        //设置该控制器的大小
        this.transformControl.setSize(0.6);
        this.transformControl.addEventListener( 'change',()=>{this.manualRender()} );
        //遍历整个控制器元素并添加标识
        this.transformControl.traverse(item=>{
            item.userData.isTransformControl=true
        })
        this.scene.add(this.transformControl)


        this.transformControl.attach( this.sphere );

        // this.transformControl.addEventListener( 'dragging-changed',  ( event )=>{
        //     this.control.enabled = ! event.value;
        // });

        this.transformControl.addEventListener( 'objectChange',  ()=>{
            // this.regenerate()
        });


    }
    addPath(){

        let arr=[
            new THREE.Vector3(-20,  -20,0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(2, 0, 0),
            new THREE.Vector3(4, 0, 0),
            new THREE.Vector3(20, 20, 0)
        ]
        this.pathScene.push(new FlowPath(arr,40,this))
    }
    addDebugBox(){
        const geometry = new THREE.SphereGeometry( 0.2, 9, 9 );
        const material = new THREE.MeshBasicMaterial( { color:new Color("#f00") } );
        const sphere = new THREE.Mesh( geometry, material );
        this.sphere=sphere;
        this.scene.add( sphere );
    }
    init() {

        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.9;
        // this.control.enableDamping=true;
        // this.control.dampingFactor = 0.08;
        // this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 0, 10);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)
        this.clock = new THREE.Clock();

    }
    animate(){

        // this.control.update()
        this.stats.update()
        let t = this.clock.getElapsedTime();

        this.pathScene.forEach(v=>{
            v.render(t)
        })

        this.renderer.render(this.scene, this.camera);
        this.raf=requestAnimationFrame(this.animate.bind(this));
    }
}