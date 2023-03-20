<template>
  <div class="root" id="physicsBaseScene">

  </div>
</template>

<script setup>
import {onMounted, onUnmounted} from "vue";
import {physicsBaseScene} from "@/views/integratedDemoLists/物理/BaseScene";

let ins;

onMounted(()=>{
  ins=new physicsBaseScene()
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