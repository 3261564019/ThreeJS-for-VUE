<template>
<div class="rootB">
  b组件的内容
  <button @click="test">测试</button>
</div>
</template>

<script setup>
// import * as m from "../data.js";
import {a,b} from "../m/index.js";

async function test() {
  // m.ins.name="hahah"
  // console.log("更改后",m)

  // import("../data.js").then(res=>{
  //   console.log("加载到的",res)
  // })

  let res=await import("../data.js")
  console.log("加载到的",res)

  // a()
  // b()
}

</script>
<script>
export default {
  name: "b"
}
</script>

<style scoped>

</style>