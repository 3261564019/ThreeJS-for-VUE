<template>
  <div id="test" ref="rootDom" @click.capture="aaa">
    {{num}}
    <input type="text" v-model="num" @change="aaa">
    <button  id="testBtn" @pointerdown.capture="add">增加</button>
    <button @click="close">关闭</button>
  </div>
</template>

<script setup name="test">
  import {ref,onMounted,onBeforeUnmount} from "vue"
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
  onBeforeUnmount(()=>{
    console.log("组件卸载了")
  })
  function close() {
    // rootDom.value.remove()
    console.log(data.value.rootElementId)

    var dom=document.getElementById(data.value.rootElementId);
    // var dom=document.getElementById("labelRenderer");
    window.dom=dom
    // dom.style.visibility="hidden"
    console.log("dom",dom)
    // dom.remove()
    dom.parentElement.removeChild(dom);

    data.value.destroy();
  }

  defineExpose({
    setData:(e)=>{
      data.value=e;
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