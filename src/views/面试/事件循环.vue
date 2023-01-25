<template>

</template>

<script setup>

console.log(1);

new Promise((resolve)=>{
  resolve()
}).then(()=>{
  console.log("promise")
});

setTimeout(()=>{
  new Promise((resolve)=>{
    resolve()
  }).then(()=>{
    console.log("setTimeout中的promise")
  });
  console.log("setTimeout")
},0)

console.log(4)

</script>

<style scoped>

</style>