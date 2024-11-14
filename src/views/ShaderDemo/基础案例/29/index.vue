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
  background: url("@/assets/img/house.png");
}
</style>