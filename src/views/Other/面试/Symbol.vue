<template>
  <video
    controls
    src="blob:https://pan.baidu.com/4ab3ea81-47f6-431c-906f-7ad2d0b24d78"
  ></video>
</template>

<script setup>

let p = {
  name: "clc",
  age: 22
}

let sname = Symbol("创建时的描述");
let gname = Symbol.for("创建时的描述Gggg");
p[sname] = "sss"
p[gname] = "ggg"
console.log(p[gname])
console.log(p[sname]);

console.log(Symbol.keyFor(gname))
console.log(Object.getOwnPropertySymbols(p))


for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i)
  }, 3000)
} 
</script>

<style scoped></style>