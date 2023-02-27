<template>

</template>

<script setup>

function Animal(name) {
  this.name=name
}
Animal.prototype.show=function () {
  console.log("Hello,我是:"+this.name)
}

let dog=new Animal("小黄");

dog.name="ggg"

dog.show=function () {
  console.log("ggggggg");
}

console.log(dog.show)
console.log(Animal.prototype.show)
</script>

<style scoped>

</style>