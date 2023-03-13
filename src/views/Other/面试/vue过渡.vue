<template>
<div class="tRoot">

  <div class="list">
    <TransitionGroup name="list" tag="ul">

    <div class="wrapper" v-for="item in list" :key="item.key">


      <div
          class="item"
          v-show="item.visible"
      >
        {{item.name}}
      </div>



<!--      <input type="radio" v-model="item.visible" :name="item.name" :value="true" />男-->
<!--      <input type="radio" v-model="item.visible" :name="item.name" :value="false" />女-->
    </div>
    </TransitionGroup>


  </div>

  <button @click="add">加</button>
  <button @click="drop">删除</button>

</div>
</template>

<script setup>
import {ref} from "vue";

let list=ref([
  {
    name:"a",
    key:1,
    visible:true
  },{
    key:2,
    name:"b",
    visible:true
  },{
    key:3,
    name:"c",
    visible:true
  },{
    key:4,
    name:"d",
    visible:true
  },{
    key:5,
    name:"e",
    visible:true
  },{
    key:6,
    name:"f",
    visible:true
  },
]);

function add() {
  list.value.splice(
      1,0,
      {
    name:Math.random(),
    key:Math.random(),
        visible:true
  });
}
function drop() {
  list.value.splice(2,1)
}



</script>

<style lang="less" scoped>
.tRoot{
  .list{
    padding: 10px;
    .wrapper{
      display: flex;
      align-items: center;
      .item{
      width: 40px;
      height: 40px;
      background: rgba(0,0,0,0.5);
      color:white;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: all 0.25s;
      border: 1px solid #eeeeee;
      margin: 10px ;
    }
    }
  }

  .list-move, /* 对移动中的元素应用的过渡 */
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  /* 确保将离开的元素从布局流中删除
    以便能够正确地计算移动的动画。 */
  .list-leave-active {
    position: absolute;
  }
}
</style>