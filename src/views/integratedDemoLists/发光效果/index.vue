<template>
  <div class="root" id="renderDom">

  </div>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted} from "vue";
import {BaseScene} from "./BaseScene";

let ins:any;

onMounted(()=>{
  ins=new BaseScene()
})
onUnmounted(()=>{
  ins.destroy()
})
</script>

<style lang="less" scoped>
.root{
  width: 100vw;
  height: 100vh;
  background: #304455;
}
</style>