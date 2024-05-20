import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import {BaseScene} from "@/views/unsuccessful/cannon调试/BaseScene";
import {BoxGeometry, MathUtils, Mesh, MeshBasicMaterial} from "three";
import {cannonToThreeVec3} from "@/views/unsuccessful/cannon调试/util";

export class PhysicBase {
    private readonly world: CANNON.World
    private ins:BaseScene
    private debug:any
    private minDelta:number=1/60
    private body:CANNON.Body
    public rayResult:CANNON.RaycastResult = new CANNON.RaycastResult();
    public rayHasHit:boolean
    private rayDebugMesh:{s:Mesh<BoxGeometry,MeshBasicMaterial>,e:Mesh<BoxGeometry,MeshBasicMaterial>}
    private rayLength:number=3;
    private debugParams: { pushOut: () => void; stop: boolean };

    constructor(ins:BaseScene) {
        let world = new CANNON.World();
        world.gravity.set(0, -9.820, 0);
        // world.broadphase = new CANNON.SAPBroadphase(world);
        // const solver = new CANNON.GSSolver();
        // solver.iterations = 1
        // world.solver = solver
        this.world = world
        this.ins=ins;
        // @ts-ignore
        this.debug = new CannonDebugger(this.ins.scene, this.world)

        this.createDebugMesh()

        this.addGround();

        this.addDebug();

        this.createBall();
    }
    createDebugMesh(){
        let size=0.5;
        this.rayDebugMesh={
            s:new Mesh(new BoxGeometry(size,size,size,1),new MeshBasicMaterial({color:"#f00"})),
            e:new Mesh(new BoxGeometry(size,size,size,1),new MeshBasicMaterial({color:"#0f0"}))
        }
        this.ins.scene.add(this.rayDebugMesh.s)
        this.ins.scene.add(this.rayDebugMesh.e)
    }
    feetRayCast(){
        // Create ray
        let body = this.body;
        const start = new CANNON.Vec3(body.position.x, body.position.y, body.position.z);
        const end = new CANNON.Vec3(body.position.x, body.position.y-this.rayLength, body.position.z);
        const rayCastOptions = {
            skipBackfaces: true      /* ignore back faces */
        };

        // Cast the ray
        let res;
        this.rayHasHit = this.world.raycastClosest(start, end,rayCastOptions,this.rayResult);

        if(this.rayHasHit)this.body.position.y=this.rayResult.hitPointWorld.y+this.rayLength;

        this.rayDebugMesh.s.position.copy(cannonToThreeVec3(body.position))
        let t=cannonToThreeVec3(end);
        t.y=this.rayResult.hitPointWorld.y;
        this.rayDebugMesh.e.position.copy(t)
        // console.log(this.rayResult)
    }
    addDebug(){
        this.debugParams={
            pushOut:()=>{
                //点击事件回调
                this.body.velocity.x=10;
            },
            stop:false,
            lerp:0.86
        }
        this.ins.dat.add(this.debugParams,"pushOut").name("施加力度");
        this.ins.dat.add(this.debugParams,"lerp",0,1).step(0.01).name("lerp");
        this.ins.dat.add(this.debugParams,"stop").name("停止").onChange(e=>{
            console.log(e)
        });
    }
    createBall(){
        const Sphere = new CANNON.Sphere(2);
        const body = new CANNON.Body({
            mass: 70, // 质量
            position: new CANNON.Vec3(-19,14,0) // 位置
        });
        body.addShape(Sphere)
        body.angularFactor.set(0, 1, 0);
        this.body=body;
        this.world.addBody(body)
    }
    addGround() {
        const floorSize = new CANNON.Vec3(40, 1, 40); // 指定平面的大小
        const floorShape = new CANNON.Box(new CANNON.Vec3(
            floorSize.x * 0.5,
            floorSize.y * 0.5,
            floorSize.z * 0.5
        ));
        const floorBody = new CANNON.Body({shape: floorShape});
        floorBody.position.set(0, -0.5, 0)
        // floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI * 0.07);
        this.world.addBody(floorBody);
    }
    render(delta: number, elapsedTime: number) {
        let d=Math.min(this.minDelta,delta);

        this.world.step(d)
        this.feetRayCast()
        if(this.debugParams.stop){
            this.body.velocity.x=MathUtils.lerp(this.body.velocity.x,0,this.debugParams.lerp)
            // this.body.velocity.x=-10
        }
        this.debug.update()
    }
}