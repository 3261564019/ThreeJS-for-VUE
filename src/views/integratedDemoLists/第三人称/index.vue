<template>
</template>
<script setup>
import {onMounted} from "vue";
import {MainScene} from "./index";
import {PhysicsLoader, Project} from "enable3d";
// import * as P from "@/assets/libs/phaser/phaser.min.js";

// console.log("pp",P)

// onMounted(()=>{
//
//   const config = {
//     type: Phaser.WEBGL,
//     transparent: true,
//     scale: {
//       mode: Phaser.Scale.FIT,
//       autoCenter: Phaser.Scale.CENTER_BOTH,
//       width: window.innerWidth, // * Math.max(1, window.devicePixelRatio / 2),
//       height: window.innerHeight // * Math.max(1, window.devicePixelRatio / 2)
//     },
//     scene: [MainScene],
//     ...Canvas({ antialias: true })
//   }
//
//   window.addEventListener('load', () => {
//     enable3d(() => new Phaser.Game(config)).withPhysics('/lib/ammo/kripken')
//   })
// })
</script>
<script >
export default {
  name: "index.vue"
}
</script>
<style lang="scss" scoped>

</style>