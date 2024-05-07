import * as CANNON from "cannon-es";

export class CannonMaterialManager {
    private map:Map<string,CANNON.Material>
    constructor(world:CANNON.World) {
        this.map=new Map()
        this.addMaterial(world)
    }

    addMaterial(world: CANNON.World){
        let ground=new CANNON.Material("ground");
        let character=new CANNON.Material("character");

        this.map.set("ground",ground)
        this.map.set("character",character)

        let temp=new CANNON.ContactMaterial(
            ground,
            character,
            {
                //摩擦力
                friction:400,

                //回弹力度
                restitution:0.001,
                // contactEquationRelaxation:400,
                //增加这个值会使得碰撞后物体的反弹更强烈，减少这个值则会导致反弹效果减弱。
                //很小会很软，类似水的材质 90 左右会回弹
                // contactEquationStiffness:500,
                // frictionEquationStiffness:100
            }
        )

        world.addContactMaterial(temp)
    }
    getMaterial(name:string){
        return this.map.get(name)!
    }
}