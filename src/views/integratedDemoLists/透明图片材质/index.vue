<template>
<div class="root">
  <div class="curve-path" id="transparentRoot">

  </div>
</div>
</template>

<script setup>

import {onMounted, onUnmounted} from "vue";
import {TransparentMaterial} from "@/views/integratedDemoLists/透明图片材质/BaseScene";

let ins;

onMounted(()=>{
  ins=new TransparentMaterial();
})
onUnmounted(()=>{
  ins.destroy()
})
</script>

<style lang="less" scoped>
.root{
  width: 100vw;
  height: 100vh;
  .curve-path{
    height: 100%;
  }
}
</style>