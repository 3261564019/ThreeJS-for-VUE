<template>
  <div id="sceneDemo">

  </div>

</template>

<script name="sceneDemo" setup>
import * as echarts from "echarts";
import {createApp, onMounted, onUnmounted, ref} from "vue";
import testCpn from "@/components/test.vue";
import {SplitScene} from "./SplitScene";

let ins;

onMounted(() => {
  ins = new SplitScene({});
})

onUnmounted(()=>{
  ins.destroy();
})

</script>

<style lang="less" scoped>
#sceneDemo{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
</style>