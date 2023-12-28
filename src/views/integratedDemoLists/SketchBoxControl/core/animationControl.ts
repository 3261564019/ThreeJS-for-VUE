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
                return value.play()
            }
        }

        // @ts-ignore
        this.aMap=aMap
        this.animationMixer = mixer
        this.cIns=ins
    }
    render(delta: number, elapsedTime: number): void {
        console.log("---",this.current)
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
    jump() {
        const action1 = this.aMap.get("jump_idle")!;
        const action2 = this.aMap.get("falling")!;
        const action3 = this.aMap.get("stop")!;
        const action4 = this.aMap.get("idle")!;
        let arr=[action1,action2,action3]
        // this.animationMixer.stopAllAction()
        arr.forEach(e=>{
            // @ts-ignore
            e.time=0
            e.reset()
        })

        //拿到当前正在正在进行的动作，过渡到第一个动作
        let current=this.aMap.get(this.current)!;
        current.crossFadeTo(action1, 0.15, false);
        this.current=""
        /**
         * fadeIn   在传入的时间间隔内，逐渐将此动作的权重（weight）由0升到1。
         * fadeOut  在传入的时间间隔内，逐渐将此动作的权重（weight）由1降至0。此方法可链式调用
         */
        //让第一个动画播放慢一点，保证和滞空时手的位置对上，不至于举太高
        action1.setEffectiveTimeScale(0.5);
        //动画3的持续时间是0.66s 将其加快1.2倍也就是 0.528s播完
        action3.setEffectiveTimeScale(1.2);
        // 播放起跳动画
        action1.Play();
        timeOut(()=>{
            // 过渡两个动画的权重，并开始播放第二个动画
            // 此时因为过渡的原因，动画1会经过3s平滑的到2
            action1.crossFadeTo(action2, 0.4, false);
            action2.Play()
            timeOut(()=>{
                // 过渡到落地动画并设置过渡时间为0.3秒
                action2.crossFadeTo(action3, 0.3, false);
                action3.Play()
                timeOut(()=> {
                    action3.crossFadeTo(action4, 0.3, false);
                    action4.play()
                },300)
            },400)
        },300)
    }
}