import house from "@/assets/img/sr.png?url"
export class CanvasDraw {

    i:HTMLCanvasElement;
    c:CanvasRenderingContext2D;

    constructor() {
        this.i=document.createElement('canvas');

        this.createDom();

        this.drawBg();
    }
    createDom(){
        let i=this.i;
        i.width=148;
        i.height=148;
        i.className="preview-canvas"
        this.c=i.getContext("2d");
        document.body.appendChild(i);
    }

    private drawBg() {
        let c=this.c;
        c.fillStyle="#202020";
        c.fillRect(0,0,c.canvas.width,c.canvas.height);

        let img=new Image()
        img.src=house;
        img.onload=()=>{
            c.drawImage(img,0,0,c.canvas.width,c.canvas.height);
        }
    }
}