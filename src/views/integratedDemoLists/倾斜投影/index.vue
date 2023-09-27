<template>
  <div class="root" id="renderDom">

  </div>
</template>

<script setup>
import {onMounted, onUnmounted} from "vue";
import {BaseScene} from "@/views/integratedDemoLists/倾斜投影/BaseScene";

let ins;

onMounted(()=>{
  ins=new BaseScene({

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