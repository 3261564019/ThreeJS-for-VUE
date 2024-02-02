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