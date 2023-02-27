<template>
<div id="curveRoot">

</div>
</template>

<script setup name="index">
import {onMounted, onUnmounted} from "vue";
import {CurveScene} from "./CurveScene";

let ins;
onMounted(()=>{
  ins=new CurveScene();
})
onUnmounted(()=>{
  ins.destroy();
})
</script>

<style lang="less" scoped>
#curveRoot{
  width: 100vw;
  height: 100vh;

}
</style>