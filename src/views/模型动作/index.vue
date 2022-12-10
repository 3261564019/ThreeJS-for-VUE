<template>
  <div id="webGl">

  </div>

</template>

<script name="sceneDemo" setup>
import * as echarts from "echarts";
import {createApp, onMounted, onUnmounted, ref} from "vue";
import testCpn from "@/components/test.vue";
import {ModelAnimation} from "./ModelAnimation";

let ins;

onMounted(() => {
  ins = new ModelAnimation();
})
onUnmounted(()=>{
  ins.destory();
})


</script>

<style lang="less" scoped>
#webGl{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
</style>