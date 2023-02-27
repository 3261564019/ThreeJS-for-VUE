<template>
  <button @click="test">aaa</button>

  <div class="wrapper">
    <div class="bfc">
      <div class="inner"></div>
    </div>
    <div class="bfc">
      <div class="inner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">


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


let a:String="sss";


interface Person{
  name:String,
  age:Number,
}

interface Car{
  owner:Person
}

let audi={
  owner:{
    name:"aaa",
    age:2
  }
} as Car;


let temp=[{name:"gg"}];


let arr=[1,2,3,4,5];
for(let i of audi.owner){
  console.log(i);
}


</script>

<style lang="less" scoped>
.wrapper{
  border: 1px solid #42b983;
  .bfc{
    overflow: hidden;
  }
  .inner{
    background: rebeccapurple;
    width: 200px;
    height: 200px;
    margin: 50px;
  }
}
</style>