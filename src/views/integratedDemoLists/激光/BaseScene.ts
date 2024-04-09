import {
    ACESFilmicToneMapping, AdditiveBlending, BoxGeometry,
    DoubleSide,
    LinearEncoding, Matrix3, Mesh, MeshBasicMaterial,
    MeshLambertMaterial, MeshPhongMaterial, Object3D,
    PlaneGeometry, PointLight, Raycaster,
    SphereGeometry, SpotLight, Texture, Vector3
} from "three";
import {BaseInit, BaseInitParams} from "@/three/classDefine/baseInit";

let Geometry, Material;
let objectArray = [];


function LaserBeam(iconfig) {

    var config = {
        length: 100,
        reflectMax: 1
    };
    config = {...config, ...iconfig};

    this.object3d = new Object3D();
    this.reflectObject = null;
    this.pointLight = new PointLight(0xffffff, 1, 4);
    var raycaster = new Raycaster();
    var canvas = generateLaserBodyCanvas();
    var texture = new Texture(canvas);
    texture.needsUpdate = true;

    //texture
    var material = new MeshBasicMaterial({
        map: texture,
        blending: AdditiveBlending,
        color: "#2fa2ee",
        side: DoubleSide,
        depthWrite: false,
        transparent: true
    });
    var geometry = new PlaneGeometry(1, 0.1 * 5);
    geometry.rotateY(0.5 * Math.PI);

    //use planes to simulate laserbeam
    var i, nPlanes = 15;
    for (i = 0; i < nPlanes; i++) {
        var mesh = new Mesh(geometry, material);
        mesh.position.z = 1 / 2;
        mesh.rotation.z = i / nPlanes * Math.PI;
        this.object3d.add(mesh);
    }

    if (config.reflectMax > 0)
        this.reflectObject = new LaserBeam({...config,...{
            reflectMax: config.reflectMax - 1
        }});


    this.intersect = function(direction, objectArray = []) {

        raycaster.set(
            this.object3d.position.clone(),
            direction.clone().normalize()
        );

        var intersectArray = [];
        intersectArray = raycaster.intersectObjects(objectArray, true);

        //have collision
        if (intersectArray.length > 0) {
            this.object3d.scale.z = intersectArray[0].distance;
            this.object3d.lookAt(intersectArray[0].point.clone());
            this.pointLight.visible = true;

            //get normal vector
            var normalMatrix = new Matrix3().getNormalMatrix(intersectArray[0].object.matrixWorld);
            var normalVector = intersectArray[0].face.normal.clone().applyMatrix3(normalMatrix).normalize();

            //set pointLight under plane
            this.pointLight.position.x = intersectArray[0].point.x + normalVector.x * 0.5;
            this.pointLight.position.y = intersectArray[0].point.y + normalVector.y * 0.5;
            this.pointLight.position.z = intersectArray[0].point.z + normalVector.z * 0.5;

            //calculation reflect vector
            var reflectVector = new Vector3(
                intersectArray[0].point.x - this.object3d.position.x,
                intersectArray[0].point.y - this.object3d.position.y,
                intersectArray[0].point.z - this.object3d.position.z
            ).normalize().reflect(normalVector);

            //set reflectObject
            if (this.reflectObject != null) {
                this.reflectObject.object3d.visible = true;
                this.reflectObject.object3d.position.set(
                    intersectArray[0].point.x,
                    intersectArray[0].point.y,
                    intersectArray[0].point.z
                );

                //iteration reflect
                this.reflectObject.intersect(reflectVector.clone(), objectArray);
            }
        }
        //non collision
        else {
            this.object3d.scale.z = config.length;
            this.pointLight.visible = false;
            this.object3d.lookAt(
                this.object3d.position.x + direction.x,
                this.object3d.position.y + direction.y,
                this.object3d.position.z + direction.z
            );

            this.hiddenReflectObject();
        }
    }

    this.hiddenReflectObject = function() {
        if (this.reflectObject != null) {
            this.reflectObject.object3d.visible = false;
            this.reflectObject.pointLight.visible = false;
            this.reflectObject.hiddenReflectObject();
        }
    }

    return;

    function generateLaserBodyCanvas() {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = 1;
        canvas.height = 64;
        // set gradient
        var gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(  0,  0,  0,0.1)');
        gradient.addColorStop(0.1, 'rgba(160,160,160,0.3)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
        gradient.addColorStop(0.9, 'rgba(160,160,160,0.3)');
        gradient.addColorStop(1.0, 'rgba(  0,  0,  0,0.1)');
        // fill the rectangle
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        // return the just built canvas
        return canvas;
    }

}


export class BaseScene extends BaseInit {
    mouse= {
        x: 0,
        y: 0
    }
    private LaserBeam1: LaserBeam;

    constructor() {
        super({
            needLight:false,
            needOrbitControls:true,
            renderDomId:"#renderDom"
        } as BaseInitParams);

        this.initDebug();

        this.init();

        // this.addLight();

        this.initMouseEvent()

        this.addMesh()


        this.LaserBeam1 = new LaserBeam({
            reflectMax: 5
        });

        this.add2Scene(this.LaserBeam1);

        this.animate()
    }
    add2Scene(obj) {
        this.scene.add(obj.object3d);
        this.scene.add(obj.pointLight);

        if (obj.reflectObject != null) {
            this.add2Scene(obj.reflectObject);
        }
    }
    initMouseEvent(){
        document.addEventListener('mousemove', (event)=>{
            this.mouse.x = (event.clientX / window.innerWidth) - 0.5
            this.mouse.y = (event.clientY / window.innerHeight) - 0.5
        }, false);
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
        this.renderer.outputEncoding = LinearEncoding;
        this.renderer.setClearColor(0x222222);
        this.renderer.shadowMap.enabled = true;
        this.camera.position.set(0, 30, 40);
        //定位相机指向场景中心
        this.camera.lookAt(this.scene.position)

    }
    animate(){
        this.stats.update()


        this.LaserBeam1.object3d.position.set(4.5, 0, 7);
        this.LaserBeam1.intersect(
            new Vector3(-4.5, 0, -4.5 + Math.cos(Date.now() * 0.05 * Math.PI / 180) * 2),
            objectArray
        );

        // camera.position.x += (mouse.x * 30 - camera.position.x) * 0.05
        // camera.position.y += (mouse.y * -10 - camera.position.y + 5) * 0.05
        // camera.lookAt(scene.position);

        this.raf=requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    private addMesh() {

        for (var i = 0; i < 5; i++) {
            Geometry = new BoxGeometry(1, 2, 4);
            Material = new MeshPhongMaterial({
                color: 0x00ff00
            });
            var Mash = new Mesh(Geometry, Material);

            Mash.position.set(
                (i % 2) * 5 - 2.5,
                0,
                i * -5
            );
            objectArray.push(Mash);
            this.scene.add(Mash);
        }
    }
}