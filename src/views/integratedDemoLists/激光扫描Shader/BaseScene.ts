import * as THREE from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit.ts";
import {Clock, Mesh} from "three";

export class BaseScene extends BaseInit {
    laser:Mesh
    gu = {
        time: {value: 0}
    }

    constructor() {
        super({
            needLight:true,
            renderDomId:"#renderDom",
            needOrbitControls:true
        } as BaseInitParams);

        this.clock=new Clock()

        this.initDebug();

        this.init();

        this.addPlan();

        this.addBall();

        this.createLine()

        this.animate()

    }
    createLine() {

        let r = 0.1, R = 20, halfAngle = THREE.MathUtils.degToRad(45);
        let g = new THREE.PlaneGeometry(1, 1, 772, 80);
        let pos = g.attributes.position;
        let uv = g.attributes.uv;
        for(let i = 0; i < pos.count; i++){
            let y = 1. - uv.getY(i);
            let radius = r + (R - r) * y;
            let x = pos.getX(i);
            pos.setXY(i, Math.cos(x * halfAngle) * radius, Math.sin(x * halfAngle) * radius);
        }
        g.rotateX(-Math.PI * 0.5);
        g.rotateY(-Math.PI * 0.5);

        let m = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0, 0.75, 1),
            side: THREE.DoubleSide,
            transparent: true,
            onBeforeCompile: shader => {
                shader.uniforms.time = this.gu.time;
                shader.fragmentShader = `
      uniform float time;
      ${shader.fragmentShader}
    `.replace(
                    `#include <color_fragment>`,
                    `#include <color_fragment>
      float t = time;
      float mainWave = sin((vUv.x - t * 0.2) * 1.5 * PI2) * 0.5 + 0.5;
      mainWave = mainWave * 0.25 + 0.25;
      mainWave *= (sin(t * PI2 * 5.) * 0.5 + 0.5) * 0.25 + 0.75;
      float sideLines = smoothstep(0.45, 0.5, abs(vUv.x - 0.5));
      float scanLineSin = abs(vUv.x - (sin(t * 2.7) * 0.5 + 0.5));
      float scanLine = smoothstep(0.01, 0., scanLineSin);
      float fadeOut = pow(vUv.y, 2.7);
      
      
      float a = 0.;
      a = max(a, mainWave);
      a = max(a, sideLines);
      a = max(a, scanLine);
      
      diffuseColor.a = a * fadeOut;
      
      `
                );
                console.log(shader.fragmentShader)
            }
        });
        m.defines = {"USE_UV": ""}


        let laser = new THREE.Mesh(g, m);
        laser.position.set(0, 1.5, 0);

        this.laser=laser
        this.scene.add(laser);
    }
    addPlan(){

        const geometry = new THREE.PlaneGeometry(40, 40);
        const material = new THREE.MeshLambertMaterial({color: "#239342"});
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
    init() {

        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.9;
        this.renderer.outputEncoding = THREE.LinearEncoding;
        this.renderer.shadowMap.enabled = true;
        this.renderer.setClearColor(0x2b2b2b); // 使用十六进制颜色表示，这里是黑色
        this.camera.position.set(0, 30, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

    }
    animate(){

        let t = this.clock.getElapsedTime();
        this.stats.update()
        this.control.update()
        this.raf=requestAnimationFrame(this.animate.bind(this));

        this.gu.time.value = t;
        this.laser.rotation.y = (Math.sin(t) * 0.5 + 0.5) * THREE.MathUtils.degToRad(90);
        this.renderer.render(this.scene, this.camera);
    }
}