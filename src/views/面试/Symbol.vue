<template>

</template>

<script setup>

let p={
  name:"clc",
  age:22
}

let sname=Symbol("创建时的描述");
let gname=Symbol.for("创建时的描述Gggg");
p[sname]="sss"
p[gname]="ggg"
console.log(p[gname])
console.log(p[sname]);

console.log(Symbol.keyFor(gname))
console.log(Object.getOwnPropertySymbols(p))


for(var i=0;i<5;i++){
  (function (p){
    setTimeout( ()=>{
      console.log(p)
    },3000)
  })(i)
}
console.log(i)

setTimeout(()=>{
  console.log(i)
},5000)

</script>

<style scoped>

</style>