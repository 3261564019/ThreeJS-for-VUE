<template>
  <div id="test" ref="rootDom" @click.stop="aaa">
    {{num}}
    <input type="text" v-model="num" @change="aaa">
    <button  id="testBtn" @pointerdown.capture="add">增加</button>
    <button @click="close">关闭</button>
  </div>
</template>

<script setup lang="ts" name="test">
import {ref, onMounted, onBeforeUnmount, onUnmounted} from "vue"
import {SetDataParams} from "../views/integratedDemoLists/高德地图/types/Gmap";
  let num=ref(14);
  let data=ref(null)
  let add=()=>{
    // console.log(num.value,'kkkk');
    num.value++;
  }
  let rootDom=ref(null)

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
  onUnmounted(()=>{
    console.log("组件卸载了")
  })

  let destroy:Function;

  function close() {
    destroy();
  }


  defineExpose({
    setData:(e:SetDataParams)=>{
      data.value=e.data;
      destroy=e.destroy
      console.log("设置成功",e)
    }
  })
</script>

<style lang="less" scoped>
#test{
  pointer-events: auto;
  z-index: 100;
  width: 140px;
  height: 100px;
  background:rgba(100,100,100,0.6);
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ffffff;
  //position: relative;
  //top:-50%;
  transform: translateY(-50% - 32px);
  input{
    width:50px;
  }
}
</style>