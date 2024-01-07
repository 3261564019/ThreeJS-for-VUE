import {Sky} from "three/examples/jsm/objects/Sky";
import {MathUtils, Scene, Vector3} from "three";
import {SketchBoxScene} from "../../SketchBoxScene";

export class SkyScene {
    sky:Sky
    private sun: Vector3;
    private ins: SketchBoxScene;

    constructor(ins:SketchBoxScene) {
        this.ins=ins
        this.initSky()
        this.addDebug()
    }

    private initSky() {
        // Add Sky
        this.sky = new Sky();
        this.sky.scale.setScalar( 300)
        this.ins.scene.add( this.sky );
        this.sun = new Vector3();
    }
    private addDebug(){
        const effectController = {
            turbidity: 10,
            rayleigh: 3,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.7,
            elevation: 2,
            azimuth: 180,
            exposure: this.ins.renderer.toneMappingExposure
        };
        const gui=this.ins.dat

        let guiChanged=()=>{

            const uniforms = this.sky.material.uniforms;
            uniforms[ 'turbidity' ].value = effectController.turbidity;
            uniforms[ 'rayleigh' ].value = effectController.rayleigh;
            uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
            uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

            const phi = MathUtils.degToRad( 90 - effectController.elevation );
            const theta = MathUtils.degToRad( effectController.azimuth );

            this.sun.setFromSphericalCoords( 1, phi, theta );

            uniforms[ 'sunPosition' ].value.copy( this.sun );

            this.ins.renderer.toneMappingExposure = effectController.exposure;

        }

        gui.add( effectController, 'turbidity', 0.0, 20.0, 0.1 ).onChange( guiChanged );
        gui.add( effectController, 'rayleigh', 0.0, 4, 0.001 ).onChange( guiChanged );
        gui.add( effectController, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( guiChanged );
        gui.add( effectController, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( guiChanged );
        gui.add( effectController, 'elevation', 0, 90, 0.1 ).onChange( guiChanged );
        gui.add( effectController, 'azimuth', - 180, 180, 0.1 ).onChange( guiChanged );
        gui.add( effectController, 'exposure', 0, 1, 0.0001 ).onChange( guiChanged )

        guiChanged()
    }
}