<template>
  <div id="container">
  </div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";

onMounted(()=>{
  console.log("aaaa")
  var map = new AMap.Map('container', {
    center: [116.54, 39.79],
    zooms: [2, 20],
    zoom: 14,
    viewMode: '3D',
    pitch: 50,
  });
})

</script>

<style lang="less" scoped>
#container{
  height: 100vh;
}
</style>