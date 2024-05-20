 
import { default as CSM } from 'three-csm';
import {BackSide, HemisphereLight, Mesh, Object3D, ShaderMaterial, SphereGeometry, UniformsUtils, Vector3} from "three";
import {SketchBoxScene} from "../../SketchBoxScene";
// @ts-ignore
import { SkyShader } from '../../shaders/SkyShader.js';
import {timeOut} from "../../../../../utils";
import {THREE} from "enable3d";

export class SkyLight extends Object3D
{
    public updateOrder: number = 5;

    public sunPosition: Vector3 = new Vector3();
    public csm: CSM;

    set theta(value: number) {
        this._theta = value;
        this.refreshSunPosition();
    }

    set phi(value: number) {
        this._phi = value;
        this.refreshSunPosition();
        this.refreshHemiIntensity();
    }

    private _phi: number = 10;
    private _theta: number = 145;

    private hemiLight: HemisphereLight;
    private maxHemiIntensity: number = 0.9;
    private minHemiIntensity: number = 0.3;

    private skyMesh: Mesh;
    private skyMaterial: ShaderMaterial;

    private SketchBoxScene: SketchBoxScene;

    constructor(SketchBoxScene: SketchBoxScene)
    {
        super()

        this.SketchBoxScene = SketchBoxScene;

        // Sky material
        this.skyMaterial = new ShaderMaterial({
            uniforms: UniformsUtils.clone(SkyShader.uniforms),
            fragmentShader: SkyShader.fragmentShader,
            vertexShader: SkyShader.vertexShader,
            side: THREE.BackSide
        });



        const skyUniforms = this.skyMaterial.uniforms;

        skyUniforms[ 'turbidity' ].value = 10;
        skyUniforms[ 'rayleigh' ].value = 2;
        skyUniforms[ 'mieCoefficient' ].value = 0.005;
        skyUniforms[ 'mieDirectionalG' ].value = 0.8;

        // Mesh
        this.skyMesh = new Mesh(
            new SphereGeometry(1010, 24, 12),
            this.skyMaterial
        );
        this.attach(this.skyMesh);

        // Ambient light
        this.hemiLight = new HemisphereLight( 0xffffff, 0xffffff, 1.0 );
        this.refreshHemiIntensity();
        this.hemiLight.color.setHSL( 0.59, 0.4, 0.6 );
        this.hemiLight.groundColor.setHSL( 0.095, 0.2, 0.75 );
        // this.hemiLight.position.set( 0, 50, 0 );
        this.SketchBoxScene.scene.add( this.hemiLight );



        this.csm = new CSM({
            fov: 80,
            far: 250,	// maxFar
            lightIntensity: 2.5,
            cascades: 3,
            shadowMapSize: 2048,
            camera: SketchBoxScene.camera,
            parent: SketchBoxScene.scene,
            mode: 'custom',
            fade:false,
            customSplitsCallback: (amount, near, far) =>
            {
                let arr = [];

                for (let i = amount - 1; i >= 0; i--)
                {
                    arr.push(Math.pow(1 / 4, i));
                }

                return arr;
            }
        });

        this.refreshSunPosition();

        SketchBoxScene.scene.add(this);

        this.addDebug()
    }
    addDebug(){

        let dat=this.SketchBoxScene.dat
        let p={
            _theta:this._theta,
            _phi:this._phi,
            power:2.6
        }

        dat.skyLight=dat.addFolder('天空及光照')

        dat.skyLight.add(p,"_theta",0,360,1).name("_theta").onChange((e:number)=>{
            this._theta=e
            this.update()
        })

        dat.skyLight.add(p,"_phi",0,360,1).name("_phi").onChange((e:number)=>{
            this._phi=e
            console.log(p)
            this.update()
        })

        dat.skyLight.add(p,"power",0,10,0.1).name("光照强度").onChange((e:number)=>{
            this.hemiLight.intensity=e

            console.log(this.skyMaterial.uniforms)
        })

    }
    //初始化的时候渲染一次
    public onceRender(){
        this.update()
    }
    public update(): void
    {
        this.position.copy(this.SketchBoxScene.camera.position);
        this.refreshSunPosition();
        // this.csm.update();
        // this.csm.lightDirection = new Vector3(-this.sunPosition.x, -this.sunPosition.y, -this.sunPosition.z).normalize();
    }
    public refreshSunPosition(): void
    {
        const sunDistance = 10;
        this.sunPosition.x = sunDistance * Math.sin(this._theta * Math.PI / 180) * Math.cos(this._phi * Math.PI / 180);
        this.sunPosition.y = sunDistance * Math.sin(this._phi * Math.PI / 180);
        this.sunPosition.z = sunDistance * Math.cos(this._theta * Math.PI / 180) * Math.cos(this._phi * Math.PI / 180);
        this.skyMaterial.uniforms.sunPosition.value.copy(this.sunPosition);
        this.skyMaterial.uniforms.cameraPos.value.copy(this.SketchBoxScene.camera.position);
    }
    public refreshHemiIntensity(): void
    {
        this.hemiLight.intensity = this.minHemiIntensity + Math.pow(1 - (Math.abs(this._phi - 90) / 90), 0.25) * (this.maxHemiIntensity - this.minHemiIntensity);
    }
}