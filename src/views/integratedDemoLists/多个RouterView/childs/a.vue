<template>
<div class="rootA">
  a组件的内容
  <button @click="update">更新</button>
</div>
</template>
<script setup>
import {num,ins as a} from "../data.js";
//
// // console.log("外部的num",num)
// console.log(ins)
//
function update() {
console.log("更改后",a)
}
//
// setTimeout(()=>{
//   console.log("ins",ins)
// },3000)
</script>
<script>
export default {
  name: "a"
}
</script>

<style scoped>

</style>