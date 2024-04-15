<template>
  <div class="shader-root" id="shaderRoot">

  </div>
</template>
<script setup lang="ts">
import {onMounted} from "vue";
import {BaseScene} from "./BaseScene";

let ins;

onMounted(()=>{
  ins=new BaseScene()
})
</script>
<script lang="ts">
export default {
  name: "index.vue"
}
</script>
<style lang="less" scoped> 

.shader-root{
  width: 100vw;
  height: 100vh;
  //background-color: #6f86f7;
  background: url("@/assets/img/house.png");
  //background-image: linear-gradient(45deg, #6f86f7 0%, #c563bf 30%, #eeb750 66%, #ffffff 100%);
  //animation: rotateGradient 10s linear infinite; /* 定义动画：持续10秒，线性变化，无限循环 */
}
</style>