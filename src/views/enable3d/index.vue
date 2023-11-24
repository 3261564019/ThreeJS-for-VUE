<template>
  <div class="index vue-root"></div>
</template>
<script setup lang="ts">
import MainScene from "@/views/enable3d/index";
import {onMounted, onUnmounted} from "vue";
import {PhysicsLoader, Project} from "enable3d";

let ins;

onMounted(()=>{
  const config = { scenes: [MainScene] }
// load the ammo.js file from the /lib folder and start the project
  //加载ammo
  PhysicsLoader('/lib', () =>{
    ins=new Project(config)
    console.log("ins",ins)
  })
})

onUnmounted(()=>{

})

</script>
<script lang="ts">
export default {
  name: "index.vue"
}
</script>
<style lang="scss" scoped>

</style>