<template>
  <div class="shader-root" id="shaderRoot">

  </div>
  <video id="tempVideo" loop muted  controls="controls" autoplay="true" src="@/views/ShaderDemo/基础案例/28/video.mp4"></video>
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
#tempVideo{
  position: fixed;
  left: 0;
  top:200px;
  width: 100px;
  height: 40px;
}
</style>