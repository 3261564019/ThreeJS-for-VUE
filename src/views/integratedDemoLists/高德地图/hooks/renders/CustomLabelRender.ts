import {CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";
import {Camera, PerspectiveCamera, Scene} from "three";
export interface CustomLabelRenderParam{
    //将渲染器的dom放到那个dom下面
    parentDom:Element
    //渲染器dom的z-index
    zIndex:string
    scene:Scene
    camera:Camera
}
export class CustomLabelRender {
    scene:Scene
    camera:Camera
    private labelRenderer: CSS2DRenderer;

    constructor(p: { camera: PerspectiveCamera; parentDom: Element | null; scene: Scene; zIndex: string }) {

        this.scene=p.scene;
        this.camera=p.camera;

        if(!p.parentDom){
            throw "CSS2DRenderer 的渲染图层不能为空"
        }

        let labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(p.parentDom.clientWidth, p.parentDom.clientHeight);
        labelRenderer.domElement.id="labelRenderer"
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        labelRenderer.domElement.style.left = '0px';
        labelRenderer.domElement.style.zIndex = p.zIndex;
        p.parentDom.appendChild(labelRenderer.domElement);
        this.labelRenderer = labelRenderer
    }
    render(scene: Scene,camera:Camera): void {
        this.labelRenderer.render(scene,camera)
    }
}