<template>
  <div class="index vue-root"></div>
</template>
<script setup lang="ts">
import MainScene from "@/views/enable3d/index";
import {onMounted} from "vue";
import {PhysicsLoader, Project} from "enable3d";

onMounted(()=>{
  const config = { scenes: [MainScene] }
// load the ammo.js file from the /lib folder and start the project
  PhysicsLoader('/lib', () => new Project(config))
})

</script>
<script lang="ts">
export default {
  name: "index.vue"
}
</script>
<style lang="scss" scoped>

</style>