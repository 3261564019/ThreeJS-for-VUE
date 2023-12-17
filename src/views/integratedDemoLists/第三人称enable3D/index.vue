<template>
  <div id="renderDom">

  </div>
</template>
<script setup>
import {onMounted} from "vue";
import {MainScene} from "./index";
import {PhysicsLoader, Project} from "enable3d";

onMounted(()=>{

    /**
     * 要保证加载的这个目录里面有以下文件
     * ammo.js
     * ammo.wasm.js
     * ammo.wasm.wasm
     */
    // enable3d(() => new Phaser.Game(config)).withPhysics('/lib/')
    PhysicsLoader('/lib/', () => {

      const project = new Project({ antialias: true, maxSubSteps: 10, fixedTimeStep: 1 / 120, scenes: [MainScene] })

      let dom=document.getElementById("renderDom")
      dom.appendChild(project.canvas)

    })

})
</script>
<script >
export default {
  name: "index.vue"
}
</script>
<style lang="less" scoped>
#renderDom{
  width: 100%;
  //height: 200px;
}
</style>