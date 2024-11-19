<template>
  <div id="canvas_container">

    <canvas
      class="root"
      id="renderDom"
    >

    </canvas>

  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { render } from "./BaseScene.js"


let vs=document.getElementsByTagName("video");
console.log("=>(index.vue:20) vs", vs);
vs[0].controls=true
vs[0].style.zIndex=999999

onMounted(() => {
  render()
}) 
</script>

<style lang="less" scoped>
.root {
  width: 100vw;
  height: 100vh;
  background: #304455;
}
</style>