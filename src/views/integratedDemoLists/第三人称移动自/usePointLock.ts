import {BaseScene} from './BaseScene';
import Ammo from "ammojs-typed";
import {Vector3} from "three";

function extendVector3(direction:Vector3, position:Vector3, distance:number) {
    const normalizedDirection = direction.clone().normalize(); // 克隆并归一化方向向量
    const newPosition = position.clone().add(normalizedDirection.multiplyScalar(distance)); // 克隆位置向量并扩展
    return newPosition;
}

export function UsePointLock(ins:BaseScene){
    let dom=ins.renderer.domElement
    let cameraPosition:Vector3

    let mouseDown=()=>{
        dom.requestPointerLock()
    }

    let mousemove=(event:MouseEvent)=>{
        /**
         * 向右x增大，向左x减小
         * 向上y减小，向下y增大
         */
        let x=-event.movementX /10
        let y=-event.movementY /20

        console.log(event.movementX,event.movementY)
        let direction=new Vector3()
        //先只处理x的,x轴的变化是相机绕着y轴运动
        ins.camera.getWorldDirection(direction)
        direction.multiplyScalar(-1)
        direction.normalize()
        // let angle=x/5000
        // console.log("aaa",x,angle)
        //绕着y轴旋转
        direction.applyAxisAngle(new Vector3(0,1,0),x)
        /**
         * 上下的话绕着x轴旋转
         *
         */
        const localXAxis = new Vector3(1, 0, 0); // 模型的本地X轴方向向量
        ins.boxMan.localToWorld(localXAxis); // 将本地坐标系中的向量转换为世界坐标系
        // localXAxis.multiplyScalar(-1)
        // localXAxis.normalize()
        direction.applyAxisAngle(localXAxis,y)

        console.log("ddd",direction)

        let res=extendVector3(direction,ins.boxMan.position,20)
        if(res.y<18){
            cameraPosition=res;

        }

        console.log("res",res)
        // ins.camera.position.add(res)

        // gsap.to(ins.camera.position, {
        //     duration: 0.1,
        //     ...res,
        //     // ease: Power1.ease, // 使用缓动函数控制速度由快至慢
        //     onComplete: function () {
        //         // 动画完成时执行的操作
        //         console.log("Animation completed");
        //     }
        // });

    }

    let debugData={
        calcMousePosition:()=>{
            /**
             * 该值是
             */
            let direction=new Vector3(-0,-0.7071067811865476,-0.7071067811865476)
            direction.multiplyScalar(-1);
            //绕着y轴旋转  x正值，视角绕着人物逆时针旋转了90°
            direction.applyAxisAngle(new Vector3(0,1,0),Math.PI/2)
            //上下的话绕着x轴旋转
            console.log("方向",direction)
            console.log("人物位置",ins.boxMan.position)
            // direction.applyAxisAngle(new Vector3(1,0,0),-Math.PI/4)
            let res=extendVector3(direction,ins.boxMan.position,10)
            // res.y=10
            console.log("目标位置",res)
            ins.camera.position.copy(res)

        },
        calcYAxis:()=>{
            // ins.boxMan.rotation.y=Math.PI/4
            ins.camera.position.set(0,0,10)
            ins.camera.lookAt(0,0,0)
            let direction=new Vector3()
            ins.camera.getWorldDirection(direction)
            direction.normalize()
            console.log("原始朝向",direction.clone())
            // direction.applyAxisAngle(new Vector3(0,1,0),Math.PI/2)
            /**
             * 绕着x轴旋转  角度正值
             * 45°是在人物背后          1/4 PI
             * 90°是人物头顶            2/4 PI
             * 135°人物前方             3/4 PI      0.75
             * 180度为人物正前方        4/4 PI
             */
            direction.applyAxisAngle(new Vector3(1,0,0),Math.PI*0.75)
            /**
             * 向前旋转到人物前方，头顶位置，同时逆时针旋转90度
             */
            direction.applyAxisAngle(new Vector3(0,1,0),Math.PI/2)

            // // //上下的话绕着x轴旋转
            // console.log("方向",direction)
            // // console.log("人物位置",ins.boxMan.position)
            let res=extendVector3(direction,ins.boxMan.position,10)
            // // // res.y=10
            // // console.log("目标位置",res)
            ins.camera.position.copy(res)
        },
        calcLocalToWorld:()=>{
            // ins.boxMan.rotation.y=Math.PI/2
            const localXAxis = new Vector3(1, 0, 0); // 模型的本地X轴方向向量
            ins.boxMan.localToWorld(localXAxis); // 将本地坐标系中的向量转换为世界坐标系
            //得到的局部坐标系是向模型左手方向的

            console.log(localXAxis);
        }
    }

    // debugData.calcMousePosition=mousemove

    ins.dat.add(debugData, "calcMousePosition").name("计算鼠标位置");
    ins.dat.add(debugData, "calcYAxis").name("计算Y轴");
    ins.dat.add(debugData, "calcLocalToWorld").name("模型局部坐标系x朝向");

    dom.addEventListener( 'mousemove', mousemove);
    dom.addEventListener( 'mousedown', mouseDown);
    //
    let render=(delta:number)=>{
        if(cameraPosition){
            ins.camera.position.x+=(cameraPosition.x - ins.camera.position.x) * delta *20;
            ins.camera.position.y+=(cameraPosition.y - ins.camera.position.y) * delta *20;
            ins.camera.position.z+=(cameraPosition.z - ins.camera.position.z) * delta *20;
        }
    }

    let destroy=()=>{
        dom.removeEventListener("mousedown",mouseDown)
        // @ts-ignore
        dom=null
    }
    return {
        destroy,
        render
    }
}