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
  <div class="title">
    Shader案例
  </div>
  <div class="item-list">
    <div class="item" v-for="item in shaderList" @click="to(item)">
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
import d6 from "@/assets/img/demo/d6.png";
import flowPath from "@/assets/img/demo/flowPath.png";
import transformControl from "@/assets/img/demo/transformControl.jpg";
import waterDemo from "@/assets/img/demo/waterDemo.png";
import physics from "@/assets/img/demo/physics.png";
import shine from "@/assets/img/demo/shine.png";
import gmap from "@/assets/img/demo/gmap.png";
import enable3d from "@/assets/img/demo/enable3d.png"
import SketchBox from "@/assets/img/demo/SketchBox.png"

import mixPic from "@/assets/img/shaderDemo/mixPic.png"
import shader1 from "@/assets/img/shaderDemo/1.png"
import shader3 from "@/assets/img/shaderDemo/3.png"
import shader4 from "@/assets/img/shaderDemo/4.png"
import shader5 from "@/assets/img/shaderDemo/5.png"
import shader7 from "@/assets/img/shaderDemo/7.png"
import shader8 from "@/assets/img/shaderDemo/8.png"
import shader9 from "@/assets/img/shaderDemo/9.png"
import shader10 from "@/assets/img/shaderDemo/10.png"
import shader11 from "@/assets/img/shaderDemo/11.png"
import shader12 from "@/assets/img/shaderDemo/12.png"
import shader13 from "@/assets/img/shaderDemo/13.png"
import shader14 from "@/assets/img/shaderDemo/14.png"

const router=useRouter();

let itemList=[
  {
    name:"射线检查该点位是否可见",
    img:d1,
    route:"/cubeDemo"
  },
  // {
  //   name:"AmmoJS练习",
  //   route:"/ammoDemo1",
  //   img:d2
  // },
  {
    name:"模型动画",
    route:"/modelAnimation",
    img:d3
  },{
    name:"模型拆分",
    route:"/splitScene",
    img:d4
  },{
    name:"模型背景",
    img:d5,
    route:"/modelBg"
  },{
    name:"曲线",
    img:d6,
    route:"/curve"

  },{
    name:"流动轨迹",
    img:flowPath,
    route:"/flowPath"
  },{
    name:"transFormControl",
    img:transformControl,
    route:"/transFormControl"
  },{
    name:"水面",
    img:waterDemo,
    route:"/water"
  },{
    name:"物理",
    img:physics,
    route:"/physics"
  },{
    name:"后期处理---发光",
    img:shine,
    route:"/shine"
  },{
    name:"结合高德地图",
    img:gmap,
    route:"/gmap"
  },{
    name:"enable3d",
    img:enable3d,
    route:"/enable3d"
  },{
    name:"SketchBox",
    img:SketchBox,
    route:"/SketchBoxControl"
  },
];

let shaderList=[
  {
    name:"混合图片",
    img:mixPic,
    route:"/ShaderDemo1"
  },{
    name:"随机顶点",
    img:shader1,
    route:"/ShaderDemo2"
  },{
    name:"乘法",
    img:shader3,
    route:"/ShaderDemo3"
  },{
    name:"取余",
    img:shader4,
    route:"/ShaderDemo4"
  },{
    name:"Step",
    img:shader5,
    route:"/ShaderDemo5"
  },{
    name:"abs",
    img:shader7,
    route:"/ShaderDemo7"
  },{
    name:"pattern8",
    img:shader8,
    route:"/ShaderDemo8"
  },{
    name:"pattern9",
    img:shader9,
    route:"/ShaderDemo9"
  },{
    name:"pattern10",
    img:shader10,
    route:"/ShaderDemo10"
  },{
    name:"pattern11",
    img:shader11,
    route:"/ShaderDemo11"
  },{
    name:"pattern12",
    img:shader12,
    route:"/ShaderDemo12"
  },{
    name:"pattern14",
    img:shader14,
    route:"/ShaderDemo14"
  }
]

function to(item) {
  console.log(item)
  router.push({path:item.route})
}

let t=new Promise(resolve => {
  setTimeout(()=>{
    resolve()
  },2000)
})

t.then(()=>{
  console.log("111")
})
t.then(()=>{
  console.log("222")
})
t.then(()=>{
  console.log("333")
})


</script>

<style lang="less" scoped>
.threeRoot{
  width: var(--block-width);
  margin: 28px auto;
  .title{
    font-size: 28px;
    font-weight: bold;
    margin-top: 12px;
    margin-bottom: 24px;
  }
  .item-list{
    margin-bottom: 10px;
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