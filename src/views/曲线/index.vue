<template>
<div id="curveRoot">

</div>
</template>

<script setup name="index">
import {onMounted} from "vue";
import {CurveScene} from "./CurveScene";

let ins;
onMounted(()=>{
  ins=new CurveScene();
})
</script>

<style lang="less" scoped>
#curveRoot{
  width: 100vw;
  height: 100vh;

}
</style>