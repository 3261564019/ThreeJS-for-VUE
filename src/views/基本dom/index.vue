<template>
  <div id="baseRoot">

  </div>
</template>

<script setup name="index">
import {onMounted} from "vue";
import {TransparentMaterial} from "@/views/透明图片材质/BaseScene";

let ins;
onMounted(()=>{
  ins=new TransparentMaterial();
})
</script>

<style lang="less" scoped>
#baseRoot{
  width: 100vw;
  height: 100vh;
}
</style>