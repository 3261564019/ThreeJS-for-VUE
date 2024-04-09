<template>
  <div class="root" id="renderDom">

  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted} from "vue";
import {BaseScene} from "./BaseScene";

let ins;

onMounted(()=>{
  ins=new BaseScene({
    renderDomId:"#renderDom"
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