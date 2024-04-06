
import * as THREE from "three";
import gsap from 'gsap';
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import clarens_night_02_4k from "@/assets/hdr/clarens_night_02_4k.hdr?url";
import {Water} from "three/examples/jsm/objects/Water2";

import tu from "@/assets/model/tu.glb?url";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export class BaseScene extends BaseInit {
    constructor(p) {
        super({
            needLight:false,
            needOrbitControls:true,
            needAxesHelper:true,
            ...p
        } as BaseInitParams);

        this.initDebug();

        this.init();

        this.addPlan();

        this.addLight();

        this.addBall();
        this.loadEnv();


        const loader = new GLTFLoader();

        loader.load(tu,res=>{
            res.scene.traverse((child) => {
                //@ts-ignore
                if (child.isMesh) {
                    child.receiveShadow = true
                    child.castShadow = true
                }
            })
            this.scene.add(res.scene)

            console.log("tu",res)
        })
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
    addPlan(){

        const geometry = new THREE.PlaneGeometry(40, 40);
        const material = new THREE.MeshLambertMaterial({color: 0x222222});
        material.side=THREE.DoubleSide
        const plane = new THREE.Mesh(geometry, material);
        //设置接受阴影
        plane.receiveShadow = true

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = -8;
        plane.position.z = 0;

        const params = {
            color: '#ffffff',
            scale: 4,
            flowX: 1,
            flowY: 1
        };

        let water = new Water( geometry, {
            color: params.color,
            scale: params.scale,
            flowDirection: new THREE.Vector2( params.flowX, params.flowY ),
            textureWidth: 1024,
            textureHeight: 1024
        } );

        water.position.y = 0;
        water.rotation.x = Math.PI * - 0.5;
        this.scene.add( water );

        //添加地板容器
        this.scene.add(plane);

        let gui=this.dat;

        gui.addColor( params, 'color' ).onChange( function ( value ) {

            water.material.uniforms[ 'color' ].value.set( value );

        } );
        gui.add( params, 'scale', 1, 10 ).onChange( function ( value ) {

            water.material.uniforms[ 'config' ].value.w = value;

        } );
        gui.add( params, 'flowX', - 1, 1 ).step( 0.01 ).onChange( function ( value ) {

            water.material.uniforms[ 'flowDirection' ].value.x = value;
            water.material.uniforms[ 'flowDirection' ].value.normalize();

        } );
        gui.add( params, 'flowY', - 1, 1 ).step( 0.01 ).onChange( function ( value ) {

            water.material.uniforms[ 'flowDirection' ].value.y = value;
            water.material.uniforms[ 'flowDirection' ].value.normalize();

        } );

        gui.open();
    }
    addLight(){

        //创建聚光灯
        const light = new THREE.SpotLight("#fff");
        light.castShadow = true;            // default false
        light.position.x = 20;
        light.position.y = 30;

        this.scene.add(light);
    }
    addBall(){

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(3, 33, 33),
            new THREE.MeshLambertMaterial({color: "#ff0000"})
        );

        sphere.position.x = 3;
        sphere.position.y = 3;
        sphere.castShadow = true

        this.scene.add(sphere);
    }
    init() {

        this.renderer.shadowMap.enabled = true;

        this.camera.position.set(0, 30, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

        // const clock = new THREE.Clock();

        const animate = () => {

            this.stats.update()

            this.raf=requestAnimationFrame(animate);

            this.renderer.render(this.scene, this.camera);
        }

        animate();

    }
}