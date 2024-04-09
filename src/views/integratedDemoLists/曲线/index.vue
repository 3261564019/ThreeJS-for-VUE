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
  background-color: #FBDA61;
  background-image: linear-gradient(45deg, #FBDA61 0%, #FF5ACD 100%);

}
</style>