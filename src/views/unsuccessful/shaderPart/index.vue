<template>
<div id="ShaderBaseScene">

</div>
</template>

<script setup lang="ts">

import {onMounted} from "vue";
import {ShaderBaseScene} from "./BaseScene";

let ins;
onMounted(()=>{
  ins=new ShaderBaseScene();
})

</script>

<style lang="less" scoped>
#ShaderBaseScene{
  width: 100%;
  height: 100vh;
  background: #304455;
}
</style>