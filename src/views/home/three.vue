<template>
<div class="threeRoot">
  <div class="title">
    ThreeJS Demo 合集
  </div>
  <div class="item-list">
    <div class="item" v-for="item in itemList" @click="to(item)">
      <img class="cover" :src="item.img" alt="">
      <div class="info">
        <span class="name">
          {{item.name}}
        </span>
      </div>
    </div>
  </div>
</div>
</template>

<script setup name="three">
import {useRouter} from "vue-router"
import img6 from "/src/assets/img/cubeImg/6.png";

import d1 from "@/assets/img/demo/d1.png";
import d2 from "@/assets/img/demo/d2.png";
import d3 from "@/assets/img/demo/d3.png";
import d4 from "@/assets/img/demo/d4.png";
import d5 from "@/assets/img/demo/d5.png";

const router=useRouter();

let itemList=[
  {
    name:"射线检查该点位是否可见",
    img:d1,
    route:"/test"
  },{
    name:"AmmoJS练习",
    route:"/ammoDemo1",
    img:d2
  },{
    name:"模型动画",
    route:"/modelAnimation",
    img:d3
  },{
    name:"模型拆分",
    route:"/splitScene",
    img:d4
  },{
    name:"AmmoJS练习",
    img:d5,
    route:"/modelBg"
  },{
    name:"AmmoJS练习",
    img:img6
  },
];

function to(item) {
  console.log(item)
  router.push({path:item.route})
}
</script>

<style lang="less" scoped>
.threeRoot{
  width: var(--block-width);
  margin: 28px auto;
  .title{
    font-size: 28px;
    font-weight: bold;
  }
  .item-list{
    flex-wrap: wrap;
    background: var(--black1);
    display: grid;
    padding: 28px;
    grid-template-columns: repeat(5,1fr);
    grid-gap:60px 30px ;
    border-radius: 8px;

    .item{
      cursor: pointer;
      transition: transform 0.2s;
      .cover{
        width: 200px;
        height: 200px;
        border-radius: 8px;
      }
      .info{
        margin-top: 10px;
      }
      &:hover{
        transform: scale(0.8);
        .info{
          .name{
            color: dodgerblue;
          }
        }
      }
    }
  }
}
</style>