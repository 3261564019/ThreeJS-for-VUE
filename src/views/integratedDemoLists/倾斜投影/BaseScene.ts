import * as THREE from "three";
import gsap from 'gsap';
import {BaseInit, BaseInitParams} from "../../../three/classDefine/baseInit";
import {B3DMLoader, TilesRenderer} from '3d-tiles-renderer';
import {Group, LoadingManager} from "three";

export class BaseScene extends BaseInit {

    TilesGroup: Group
    private tilesRendererArr: TilesRenderer[] = [];

    constructor() {
        super({
            renderDomId: "#renderDom",
            needLight: false,
            needOrbitControls: true
        } as BaseInitParams);

        this.TilesGroup = new Group();

        this.scene.add(this.TilesGroup);

        this.initDebug();

        this.init();

        this.addPlan();

        this.addLight();

        this.addBall();

        // this.loadLocalTiles();

        this.loadNetWorkData();


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

    loadLocalTiles() {
        let render = new TilesRenderer("/src/data/tileset.json");
        console.log("渲染器", render.group)
        render.setCamera(this.camera);
        render.setResolutionFromRenderer(this.camera, this.renderer);
        render.group.scale.set(0.1, 0.1, 0.1)
        render.group.position.set(-20, 0, 0);
        this.scene.add(render.group);

        this.tilesRendererArr.push(render)
    }

    loadNetWorkData() {
        /**
        fetch("https://data.mars3d.cn/3dtiles/qx-shequ/tileset.json")
            .then((response) => {
                return response.json();
            })
            .then((res) => {
                console.log("网络结构", res)
                const arr = res.root.children
                for (const item of arr) {
                    for (const part of item.children) {
                        if (part.content.url) {
                            loadJSON("https://data.mars3d.cn/3dtiles/qx-shequ/" + part.content.url)
                        }
                    }

                    // console.log(qzpath + tilese.content.uri)

                    // let render = new TilesRenderer( "https://data.mars3d.cn/3dtiles/qx-shequ/" + tilese.content.uri )
                    // render.setCamera( this.camera )
                    // render.setResolutionFromRenderer( this.camera, this.renderer )
                    // const tilesObj = render.group
                    // tilesObj.rotation.set(-Math.PI / 2, 0, 0)
                    // this.scene.add( tilesObj )
                    // this.tilesRendererArr.push(render)
                }
            })
            **/

        /**
         * 加载子部分 children
         * @param url
         */
        function loadJSON(url: string) {
            fetch(url).then((response) => {
                return response.json();
            }).then((res) => {
                let base=extractURL(url)
                console.log("url",url)
                    console.log("B3dm", res)
                let bUrl=res.root.content.url
                if(bUrl.endsWith(".b3dm")){
                    loadB3dm(base+bUrl)
                }
            })
        }


        const headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*'); // 添加 CORS 头信息
        let loadB3dm=(url: string)=>{
            let m=new LoadingManager()
            const loader = new B3DMLoader(m);
            console.log("----b3dm",url)
            loader.load(url).then(res=>{
                this.scene.add(res.scene)
                res.scene.position.set(-100,-100,10)
                console.log("根据b3dm加载出的内容",res)
            }).catch(e=>{
                console.log("加载失败",e)
            })
        }

        // loadB3dm("src/assets/city.b3dm")
        // loadB3dm("src/assets/boat3.b3dm")
        // loadB3dm("src/data/0.b3dm")
        // loadB3dm("src/assets/wc.b3dm")
        loadB3dm("src/assets/p003.b3dm")
        // res.scene.traverse((model) => {
        //     if (model.isMesh) {
        //         model.material.side = THREE.BackSide; //背面可见
        //         model.material.side = THREE.DoubleSide;//两侧的面可见
        //     }
        // })
        // this.TilesGroup.add(res.scene);
    }

    addLight() {

        //创建聚光灯
        const light = new THREE.AmbientLight("#fff");
        light.castShadow = true;            // default false
        light.position.x = 20;
        light.position.y = 30;

        this.scene.add(light);
    }

    addBall() {

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

        // this.renderer.shadowMap.enabled = true;

        this.camera.position.set(0, 30, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

        // const clock = new THREE.Clock();

        const animate = () => {

            this.stats.update()

            this.raf = requestAnimationFrame(animate);

            this.tilesRendererArr?.forEach(v => v.update())
            this.renderer.render(this.scene, this.camera);
        }

        animate();

    }
}

function extractURL(str: string): string {
    const lastIndex = str.lastIndexOf('/');
    if (lastIndex === -1) {
        return '';
    }
    return str.substring(0, lastIndex + 1);
}