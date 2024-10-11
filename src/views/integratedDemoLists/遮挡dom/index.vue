<template>
  <div id="css"></div>
  <div id="webgl"></div>
</template>

<script setup>
import {onMounted, onUnmounted} from "vue";

onMounted(()=>{
import("./BaseScene.js")
})
onUnmounted(()=>{
})
</script>

<style lang="less" >
body {
  background-color: #ffffff;
  margin: 0;
  overflow: hidden;
}
#css, #webgl {
  width: 100%;
  height: 100%;
  position: absolute;
  //top: 0; left: 0;
}

#webgl {
  pointer-events: none;
}

</style>