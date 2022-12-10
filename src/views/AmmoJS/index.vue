<template>
  <div id="ammoSceneDemo">

  </div>
</template>

<script setup name="index">
import {onMounted,onUnmounted} from "vue";
import {AmmoDemo1} from "./AmmoDemo1";

let ins;

onMounted(()=>{
  ins=new AmmoDemo1();
})
onUnmounted(()=>{
  ins.destory();
})
</script>

<style lang="less" scoped>
#ammoSceneDemo{
  width: 100%;
  height: 100vh;
  background: #424242;
}
</style>