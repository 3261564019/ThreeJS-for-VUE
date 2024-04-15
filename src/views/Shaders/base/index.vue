<template>
  <div class="root" id="shaderDemo">

  </div>
</template>

<script setup>
import {onMounted, onUnmounted} from "vue";
import {BaseScene} from "./BaseScene";

let ins;

onMounted(()=>{
  ins=new BaseScene()
})
onUnmounted(()=>{
  ins.destroy();
})
</script>

<style lang="less" scoped>
.root{
  width: 100vw;
  height: 100vh;
  background-color: #4158D0;
  background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
}
</style>