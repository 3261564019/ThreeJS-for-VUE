<template>
  <div class="root" id="WaterRenderDom">

  </div>
</template>

<script setup>
import {onMounted, onUnmounted} from "vue";
import {BaseScene} from "./BaseScene.ts";

let ins;

onMounted(()=>{
  ins=new BaseScene({
    renderDomId:"#WaterRenderDom"
  })
})

onUnmounted(()=>{
  ins.destroy();
})
</script>

<style lang="less" scoped>
.root{
  width: 100vw;
  height: 100vh;
  background: #304455;
}
</style>