import {AnimationAction, AnimationMixer, Group} from "three";
import {Character} from "./character";
import {MyAnimationAction, Updatable} from "../type";
import {mix} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import {timeOut} from "../../../../utils";

export class AnimationControl implements Updatable{
    private animationMixer: AnimationMixer;
    //当前在执行的动画
    private current:string
    //拥有的动画列表
    aMap: Map<string, MyAnimationAction>;

    cIns:Character

    constructor(
        aMap: Map<string, AnimationAction>,
        mixer:AnimationMixer,
        ins:Character
    ) {

        const values = aMap.values();

        // 遍历迭代器对象，并访问每个值
        for (const value of values) {
            // @ts-ignore
            value.Play=()=>{
                this.current=value.getClip().name
                console.log("ppp",this.current)
                return value.play()
            }
        }

        // @ts-ignore
        this.aMap=aMap
        this.animationMixer = mixer
        this.cIns=ins

        ins.ins.dat.add(this,"test").name("测试")
    }
    render(delta: number, elapsedTime: number): void {
        // console.log("---",this.current)
        // delta/=2
        this.animationMixer.update(delta);
    }
    play(name:string){
        // this.current=name
        console.log("拿到的动画",this.aMap.get(name))
        this.aMap.get(name)!.Play()
    }
    init(){
        this.play("idle")
    }
    test(){

        const action1 = this.aMap.get("idle")!;
        const action2 = this.aMap.get("falling")!;



        action1.fadeOut(0.5);
        action2.reset()
        action2.fadeIn(0.5).play();

        timeOut(()=>{
            action2.fadeOut(0.5);
            action1.reset().fadeIn(0.5).play();
            },1200)


        console.log("aaa")

    }
    stop(){
        if(this.current!=='idle') {
            const current = this.aMap.get(this.current)!;
            const idle = this.aMap.get("idle")!;
            current.fadeOut(0.2)
            // @ts-ignore
            idle.reset().fadeIn(0.2).Play()
        }
    }
    walk(){
        //当前不在行走的动画，并且不在跳跃过程中才能走
        if(this.current!=='run' && this.cIns.canJump){
            //拿到当前正在正在进行的动作，过渡到第一个动作
            let current=this.aMap.get(this.current)!;
            const run = this.aMap.get("run")!;
            current.fadeOut(0.2)
            // @ts-ignore
            run.reset().fadeIn(0.2).Play()
        }
    }
    jump() {
        //把需要执行的三个动画停止并重置
        const action1 = this.aMap.get("jump_idle")!;
        const action2 = this.aMap.get("falling")!;
        const action3 = this.aMap.get("stop")!;
        let arr=[action1,action2,action3]

        arr.forEach(e=>{
            e.stop()
            e.reset()
        })

        //拿到当前正在正在进行的动作，过渡到第一个动作
        let current=this.aMap.get(this.current)!;
        current.fadeOut(0.1)

        //让第一个动画播放慢一点，保证和滞空时手的位置对上，不至于举太高
        action1.setEffectiveTimeScale(1);
        //动画3的持续时间是0.66s 将其加快1.2倍也就是 0.528s播完
        action3.setEffectiveTimeScale(0.9);

        // 播放起跳动画
        // @ts-ignore
        action1.reset().fadeIn(0.1).Play();

        timeOut(()=>{
            action1.fadeOut(0.2);
            // @ts-ignore
            action2.reset().fadeIn(0.2).Play()
            timeOut(()=> {
                /**
                 * 这一步很重要,在已经过渡到其他动画后，将当前动画停止掉，否则会混乱
                 */
                current.stop()
                action2.fadeOut(0.2);
                // @ts-ignore
                action3.reset().fadeIn(0.2).Play()
                timeOut(()=> {

                    let isWalk=this.cIns.checkMove()
                    let target;
                    console.log('结束时是否在run ',isWalk)
                    if(isWalk){
                        target=this.aMap.get("run")!;
                    }else{
                        target=this.aMap.get("idle")!;
                    }
                    action3.fadeOut(0.3);
                    // @ts-ignore
                    target.reset().fadeIn(0.3).Play()
                },200)
            },700)
        },100)

    }
}