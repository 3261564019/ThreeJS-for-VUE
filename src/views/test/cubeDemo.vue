<template>
<div id="cubeDemo">
<!--  {{value}}-->
</div>
</template>

<script name="cubeDemo" setup>
import {ref,onMounted} from "vue";
import {CubeScene} from "./CubeScene";

let value =ref("bbb");

let threeIns=null;

onMounted(()=>{
  threeIns =new CubeScene();
})
</script>

<style lang="less" scoped>
#cubeDemo{
  width: 100vw;
  height: 100vh;
  //background: #42b983;
}
</style>