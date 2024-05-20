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
                friction:0,
                frictionEquationRelaxation:3,
                restitution:0,
                //回弹力度
                contactEquationRelaxation:9,
                contactEquationStiffness:1e7,

            }
        )

        // world.addContactMaterial(temp)
    }
    getMaterial(name:string){
        return this.map.get(name)!
    }
}