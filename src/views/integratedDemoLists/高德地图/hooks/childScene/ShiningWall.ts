
import {BufferAttribute, BufferGeometry, Scene, Texture} from "three";
import {GMapIns} from "../../types/Gmap";
import {GMapRender} from "../index";
import * as THREE from "three";
// @ts-ignore
import {generateVecData,hexToRgba} from "@/views/integratedDemoLists/高德地图/hooks/util/index.js"
import {ChildScene} from "./type/ChildScene";


export interface ShiningWallConstructParams{
    scene: Scene
    mapIns?: GMapIns
    renderIns?: GMapRender
    wallPath:Array<number[]>
    color:string,
    //当前是否仅在Three的坐标下
    onlyThreeScene?:Boolean
}

export class ShiningWall extends ChildScene {
    //经纬度数组
    private readonly paths:Array<number[]>[]=[]
    //贴图偏移量
    private texture_offset:number=0
    //当前贴图对象
    private readonly texture:Texture
    constructor(params:ShiningWallConstructParams) {
        // @ts-ignore
        super(params.scene, params.mapIns, params.renderIns);

        if(params.onlyThreeScene){
            this.paths=[params.wallPath]
        }else{
            this.paths=this.mapIns.customCoords.lngLatsToCoords([params.wallPath])
        }
        // console.log("参数",params.wallPath)
        // console.log("path转换后",this.paths)

        let faceList:number[] = []
        let faceVertexUvs:number[] = []

        // 合并多个闭合范围
        for (let i = 0; i < this.paths.length; i++) {
            const { face, uvs } = generateVecData(this.paths[i],params.onlyThreeScene?10:50)
            faceList = [...faceList, ...face]
            faceVertexUvs = [...faceVertexUvs, ...uvs]
        }

        // 背景层
        const geometry = new BufferGeometry()
        geometry.setAttribute('position', new BufferAttribute(new Float32Array(faceList), 3))
        geometry.setAttribute('uv', new BufferAttribute(new Float32Array(faceVertexUvs), 2))



        const geometry2 = geometry.clone()
        this.texture = this.generateTexture(32, params.color)
        this.texture.wrapS = THREE.RepeatWrapping // 水平重复平铺
        this.texture.wrapT = THREE.RepeatWrapping // 垂直重复平铺

        const material2 = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
            map: this.texture
        })

        const mesh2 = new THREE.Mesh(geometry2, material2)

        if(params.onlyThreeScene) {
            mesh2.rotation.x=Math.PI*-0.5
        }

        params.scene.add(mesh2)

    }
    render(delta: number, elapsedTime: number): void {
        // 纹理偏移
        this.texture_offset = - elapsedTime  // 向上移动
        this.texture.offset.set(0, this.texture_offset)
    }
    generateTexture(size = 32, color ="#ff0000"){

        let canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        let ctx = canvas.getContext('2d')
        if(ctx){
            // @ts-ignore
            let linearGradient = ctx.createLinearGradient(0,0,0,size)
            linearGradient.addColorStop(0.2, hexToRgba(color, 0.0))
            linearGradient.addColorStop(0.8, hexToRgba(color, 0.5))
            linearGradient.addColorStop(1.0, hexToRgba(color, 1.0))
            ctx.fillStyle = linearGradient
            ctx.fillRect(0,0, size, size)
        }

        let texture = new Texture(canvas)
        texture.needsUpdate = true //必须
        return texture
    }
}


