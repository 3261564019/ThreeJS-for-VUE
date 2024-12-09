<template>
  <div class="shader-root" id="shaderRoot">

  </div>
</template>
<script setup lang="ts">
import {onMounted} from "vue";
import {BaseScene} from "./BaseScene";
import {Texture} from "three";

let ins:BaseScene;


onMounted(()=>{

  ins=new BaseScene()
})
</script>
<script lang="ts">
export default {
  name: "index.vue"
}
</script>
<style lang="less">
@keyframes rotateGradient {
  from {
    background-image: linear-gradient(0deg, #6f86f7 0%, #c563bf 30%, #eeb750 66%, #ffffff 100%);
  }
  to {
    background-image: linear-gradient(360deg, #6f86f7 0%, #c563bf 30%, #eeb750 66%, #ffffff 100%);
  }
}

.shader-root{
  width: 100vw;
  height: 100vh;
  background-color: #000;
  //background: url("@/assets/img/house.png");
  //background-image: linear-gradient(45deg, #6f86f7 0%, #c563bf 30%, #eeb750 66%, #ffffff 100%);
  //animation: rotateGradient 10s linear infinite; /* 定义动画：持续10秒，线性变化，无限循环 */
}
.testVideo{
  width: 400px;
  //position: fixed;
  top: 500px;
  left: 0;
}
</style>