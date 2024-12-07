import point from "@/assets/img/point.png?url"
import house from "@/assets/img/house.png?url"
import {Vector2} from "three";
export class CanvasDraw {

    i:HTMLCanvasElement;
    c:CanvasRenderingContext2D;
    width=148;
    height=148;
    img=new Image()

    pointSize:number;

    constructor() {
        this.i=document.createElement('canvas');
        this.img.src=point;
        this.pointSize=this.width*0.2
        this.createDom();

        this.drawBg();
    }
    createDom(){
        let i=this.i;
        i.width=this.width;
        i.height=this.height;
        i.className="preview-canvas"
        this.c=i.getContext("2d");
        this.c.globalCompositeOperation="lighten"
        document.body.appendChild(i);
    }

    private drawBg() {
        let c=this.c;
        c.fillStyle="#000";
        c.fillRect(0,0,c.canvas.width,c.canvas.height);
        //
        // let img=new Image()
        // img.src=house;
        // img.onload=()=>{
        //     c.drawImage(img,0,0,c.canvas.width,c.canvas.height);
        // }
    }

    public draw(uv:Vector2){
        let c=this.c;

        let s=this.pointSize
        let hs=s/2;

        //通过覆盖的形式在上面
        this.c.globalCompositeOperation="source-over"
        c.fillStyle="#000"
        c.globalAlpha=0.02;
        c.fillRect(0,0,c.canvas.width,c.canvas.height,)

        //把上次画的内容通过半透明遮罩将其变暗再画本次的内容
        this.c.globalCompositeOperation="lighten"
        c.globalAlpha=1;
        c.drawImage(
            this.img,
            uv.x*this.width-hs,
            (1-uv.y)*this.height-hs,
            s,
            s
            );
    }
}