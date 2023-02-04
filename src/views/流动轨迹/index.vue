<template>
<div class="root">
  <div class="curve-path" id="curve-path">

  </div>
</div>
</template>

<script setup>

import {onMounted} from "vue";
import {CurvePath} from "@/views/流动轨迹/BaseScene";

let ins;

onMounted(()=>{
  ins=new CurvePath();
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