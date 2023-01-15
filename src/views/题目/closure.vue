<template>
  <button @click="test">aaa</button>
</template>

<script setup>


function Store() {
  let num=10;

  function add() {
    num++;
  }
  function get() {
    return num
  }

  return {
    add,get
  }
}

let ins=Store();

function test() {
  ins.add();
  console.log(ins.get())
}

console.log(ins);

</script>

<style scoped>

</style>