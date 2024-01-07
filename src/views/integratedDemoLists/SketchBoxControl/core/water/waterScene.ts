import {SketchBoxScene} from "../../SketchBoxScene";
import {Mesh, PlaneGeometry, TextureLoader} from "three";
import {Water} from "three/examples/jsm/objects/Water";
import {THREE} from "enable3d";
import water from "@/assets/img/waternormals.png"
import {Updatable} from "../../type";
export class WaterScene implements Updatable {
    private water: Water;

    constructor(ins:SketchBoxScene,mesh:Mesh) {
        this.create(ins,mesh)
    }

    private create(ins: SketchBoxScene, mesh: Mesh) {
        const waterGeometry = new PlaneGeometry( 8, 8 );


        this.water = new Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new TextureLoader().load( water, function ( texture ) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                } ),
                // @ts-ignore
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 3.7,
            }
        );

        let uniforms=this.water.material.uniforms
        uniforms.size.value=4.2
        uniforms.distortionScale.value=0.5
        ins.dat.skyLight.add(uniforms.size,"value", 0.1, 10, 0.1 ).name( '水面缩放' );
        ins.dat.skyLight.add(uniforms.distortionScale,"value", 0.1, 10, 0.1 ).name( 'distortionScale' );


        this.water.rotation.x = - Math.PI / 2;
        this.water.position.copy(mesh.position)
        this.water.position.y+=0.01
        // this.water.quaternion.copy(mesh.quaternion)
        ins.scene.add(this.water)
    }

    render(delta: number, elapsedTime: number): void {
        this.water.material.uniforms[ 'time' ].value+=delta
    }
}