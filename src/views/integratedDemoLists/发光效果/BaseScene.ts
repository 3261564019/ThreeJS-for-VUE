
import * as THREE from "three";
import gsap from 'gsap';
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";

export class BaseScene extends BaseInit {

    params={
        exposure: 1,
        bloomStrength: 5,
        bloomThreshold: 0,
        bloomRadius: 0,
        scene: 'Scene with Glow'
    };

    bloomComposer:any=null
    finalComposer:any=null
    bloomPass:any=null

    constructor() {
        super({
            needLight:false,
            renderDomId:"#renderDom",
            needOrbitControls:true,
            needAxesHelper:true,
            renderBg:"#000"
        } as BaseInitParams);

        this.initDebug();


        this.addPlan();

        this.addLight();

        this.addBall();

        //初始化效果混合器
        const bloomComposer = new EffectComposer( this.renderer );
        bloomComposer.renderToScreen = false;

        const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
        bloomPass.threshold = this.params.bloomThreshold;
        bloomPass.strength = this.params.bloomStrength;
        bloomPass.radius = this.params.bloomRadius;

        bloomComposer.addPass( bloomPass );

        this.bloomPass=bloomPass;



        const finalPass = new ShaderPass(
            new THREE.ShaderMaterial( {
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: bloomComposer.renderTarget2.texture }
                },
                vertexShader: `
                    varying vec2 vUv;

                        void main() {
                        
                        vUv = uv;
                        
                        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                    
                    }
                `,
                fragmentShader:`
                    uniform sampler2D baseTexture;
                    uniform sampler2D bloomTexture;
                    
                    varying vec2 vUv;
                    
                    void main() { 
                        gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
                    }
                `,
                defines: {}
            } ), 'baseTexture'
        );
        finalPass.needsSwap = true;
        this.bloomComposer=bloomComposer
        //创建最终混合器

        const finalComposer = new EffectComposer( this.renderer );

        finalComposer.addPass( renderScene );
        finalComposer.addPass( finalPass );

        this.finalComposer=finalComposer


        this.run();

        this.addDebug()

        this.renderer.toneMappingExposure=0.45
    }
    addDebug(){

        this.dat.add( this.params, 'exposure', 0.1, 2 ).onChange(  ( value )=>{

            this.renderer.toneMappingExposure = Math.pow( value, 4.0 );
            this.manualRender()
        } );

        this.dat.add( this.params, 'bloomThreshold', 0.0, 1.0 ).onChange(  ( value )=>{

            this.bloomPass.threshold = Number( value );
            this.manualRender()


        } );

        this.dat.add( this.params, 'bloomStrength', 0.0, 10.0 ).onChange( ( value )=>{

            this.bloomPass.strength = Number( value );
            this.manualRender()

        } );

        this.dat.add( this.params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange(  ( value )=>{
            this.bloomPass.radius = Number( value );
            this.manualRender()

        } );

    }
    addPlan(){

        const geometry = new THREE.PlaneGeometry(40, 40);
        const material = new THREE.MeshLambertMaterial({color:"#222"});
        material.side=THREE.DoubleSide
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
    addLight(){

        //创建聚光灯
        const light = new THREE.SpotLight("#FFF");
        light.intensity=1
        light.castShadow = true;            // default false
        light.position.x = 20;
        light.position.y = 30;
        light.lookAt(0,0,0)
        this.scene.add(light);
    }
    addBall(){

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(3, 33, 33),
            new THREE.MeshLambertMaterial({color: "#2e6f83"})
        );

        sphere.position.x = 0;
        sphere.position.y = 3;
        sphere.castShadow = true
        // sphere.layers.set(1)
        this.scene.add(sphere);
    }
    run() {

        this.renderer.shadowMap.enabled = true;

        this.camera.position.set(0, 30, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

        // const clock = new THREE.Clock();

        const animate = () => {

            this.stats.update()

            this.raf=requestAnimationFrame(animate);

            // this.renderer.render(this.scene, this.camera);
            // this.bloomComposer.render();
            // this.finalComposer.render();
        }

        animate();

    }
}