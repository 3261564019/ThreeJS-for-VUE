<template>
  <div class="root" id="renderDom">

  </div>
  {{points}}
</template>

<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {BaseScene} from "./BaseScene";

let ins;

let points=ref([])

onMounted(()=>{
  ins=new BaseScene(e=>{
    console.log("收到",e)
    points.value.push(e);
  })

})
onUnmounted(()=>{
  ins.destroy();
})
</script>

<style lang="less" scoped>
.root{
  width: 660px;
  height: 827px;
  background-image: url("@/assets/img/demo/xjmap.png");
  background-size: 100% 100%;
  background-color: #cccccc;
}
</style>