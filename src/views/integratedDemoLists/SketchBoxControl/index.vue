<template>
  <div class="root" id="renderDom">

  </div>
</template>

<script setup>
import {onMounted, onUnmounted} from "vue";
import {SketchBoxScene} from "./SketchBoxScene";

let ins;

onMounted(()=>{
  ins=new SketchBoxScene()
})
onUnmounted(()=>{
  ins.destroy();
})
</script>

<style lang="less" scoped>
.root{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #304455;
}
</style>