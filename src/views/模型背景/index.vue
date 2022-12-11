<template>
<div class="modelView" @click="move">
  <div class="content-wrapper">
    <div class="content">
      <part1></part1>
    </div>
  </div>
</div>
</template>

<script setup>

import {ref, computed, onMounted} from "vue";
import {debounce} from "@/utils";
import Part1 from "@/views/模型背景/home_part/part1.vue";

// let translateY=ref("0px")
let current=ref(0);
let clientHeight=ref(document.body.clientHeight);
/**
 * 切换轮播
 * @param direction -1 向上滚 1向下
 */
function move(direction) {
  return
  current.value++;
  if(current.value===3){
    current.value=0
  }
}

let translateY=computed(()=>{
  return -current.value*clientHeight.value+"px";
});



function setHeight(){
  clientHeight.value=document.body.clientHeight
  console.log("aaa",document.body.clientHeight)
}
window.addEventListener("resize",debounce(setHeight,500));
onMounted(()=>{
  setHeight();
})
</script>

<style lang="less" scoped>
.modelView{
  min-height:100vh;
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
  .content-wrapper{
    transition: all 0.25s;
    transform: translateY(v-bind(translateY));
    .content{
      height: 100vh;
      &:nth-child(1){
        background:#42b983;
      }
      &:nth-child(2){
        background:#304455;
      }
      &:nth-child(3){
        background: #ff7fa0;
      }
    }
  }
}
</style>