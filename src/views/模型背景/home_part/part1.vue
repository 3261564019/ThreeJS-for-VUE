<template>
<div class="part1Root">
  <div class="block nav-wrapper">
    <div
        :class="['item',{'active':active===index}]"
        v-for="(item,index) in navList"
        @click.stop="tabClick(index)"
    >
      {{item.name}}
    </div>
  </div>

  <div class="block" id="renderBg1"></div>

  <div class="block info-wrapper">
    <div class="line1">The</div>
    <div class="line2">THREE GRACES</div>
    <div class="throw"></div>
    <div class="texts">
      China's financial hub of Shanghai was taking baby steps towards easing COVID-19 curbs with residents having mixed reactions on Monday. Meanwhile, residents in China’s capital Beijing also expressed mixed opinions toward the easing of the world’s toughest COVID-19 restrictions, as a patchwork of easing measures sowed confusion across the country hoping for more clarity on specific policies.
    </div>
  </div>
</div>
</template>

<script name="part1" setup>

import {ref,onMounted} from "vue";
import {Part1Scene} from "@/views/模型背景/home_part/BaseScene";
let active=ref(0);
let navList=ref([
  {
    name:"ART"
  }, {
    name:"ABOUT"
  }, {
    name:"VISIT"
  }, {
    name:"SHOP"
  }, {
    name:"SEARCH"
  },
])

function tabClick(i) {
  active.value=i
}
// http://qrtest.qirenit.com:81/share/img/cemetery_angel_-_fisher/scene.gltf

let ins;

onMounted(()=>{
  ins=new Part1Scene({
    renderDomId:"#renderBg1"
  });
})

</script>

<style lang="less" scoped>
.part1Root{
  height: 100%;
  background: #000;
  position: relative;
  z-index: 10;
  .nav-wrapper{
    padding: 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    letter-spacing: 2px;
    font-weight: bold;
    cursor: pointer;

    .item{
      border-bottom: 3px solid transparent;
      padding-bottom: 10px;
      transition: all 0.2s;
    }
    .active{
      border-bottom: 3px solid #fff;
    }
  }
  .info-wrapper{
    height: 380px;
    position: absolute;
    bottom: 34px;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .line1{
      font-size:48px;
      //font-family: "Courier New";
    }
    .line2{
      font-size: 50px;
      font-weight: bold;
      letter-spacing: 25px;
      //font-family: "Apple Chancery", cursive, serif, sans-serif;
    }

    .throw{
      width: 100px;
      height: 5px;
      background: var(--black1);
      border-radius: 5px;
    }

    .texts{
      line-height: 32px;
      letter-spacing: 1px;
      font-size: 15px;
    }
  }
  #renderBg1{
    z-index: 100;
    //background: #42b983;
    height: 100%;
  }
}
</style>