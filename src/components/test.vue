<template>
<div id="test" @click.capture="aaa">
  {{num}}
  <input type="text" v-model="num" @change="aaa">
  <button  id="testBtn" @pointerdown.capture="add">增加</button>
</div>
</template>

<script setup name="test">
  import {ref,onMounted} from "vue"
  let num=ref(14);
  let add=()=>{
    // console.log(num.value,'kkkk');
    num.value++;
  }

  let arr=[1,2,3,4,5];

  // delete arr[0];

  arr.splice(arr.indexOf(1),1)

  console.log("删除后",arr);

  function aaa(){
    console.log("eeeee")
    // alert("1111");
  }

  onMounted(()=>{

    let dom =document.querySelector("#testBtn");

    console.log("dom",dom)
    dom.onclick=()=>{
      console.log("1111");
    }
  })



</script>

<style lang="less" scoped>
#test{
  pointer-events: auto;
  z-index: 100;
  width: 100px;
  height: 100px;
  background:rgba(100,100,100,0.6);
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #ffffff;
}
</style>