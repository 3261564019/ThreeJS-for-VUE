<template>
  <div class="root">
    <div class="wrapper"   >
      <button @click.capture="temp('out')">out</button>
    </div>
    <div class="inner">
      <button @click="temp('inner')">inner</button>
    </div>
  </div>
</template>

<script setup>


function temp(e) {
  console.log(e)
}
//
// new Promise((resolve)=>{
//   resolve()
// }).then(()=>{
//   console.log("promise")
// });
//
// setTimeout(()=>{
//   new Promise((resolve)=>{
//     resolve()
//   }).then(()=>{
//     console.log("setTimeout中的promise")
//   });
//   console.log("setTimeout")
// },0)
//
// console.log(4)

</script>

<style lang="less" scoped>
.root{
  .wrapper{
    width: 100vw;
    height: 100vh;
    z-index: 100;
    position: relative;
  }
  .inner{
    padding: 50px;
    position: fixed;
    top:10px;
    pointer-events: auto;
  }
}
</style>