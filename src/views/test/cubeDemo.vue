<template>
<div id="cubeDemo">
<!--  {{value}}-->
  <div :class="['infoItem',{'visible':item.show}]"
       v-for="item in infoList"
       v-show="item.show"
       :style="{transform:'translate('+item.style.x+'px,'+item.style.y+'px)'}"
  >
    <div class="label">
      {{item.label}}
    </div>
    <div class="des">
      {{item.description}}
    </div>
  </div>
</div>
</template>

<script name="cubeDemo" setup>
import {ref,onMounted} from "vue";
import {CubeScene} from "./CubeScene";
import * as THREE from "three";


let threeIns=null;

let infoList=ref([
  {
    label:"1",
    //当前标签是否显示
    show:true,
    description:"关于本点的描述，关于本点的描述，关于本点的描述，关于本点的描述，关于本点的描述，关于本点的描述，关于本点的描述，关于本点的描述。",
    position:new THREE.Vector3(4.2,2.2,0),
    style:{
      x:0,
      y:0
    }
  },{
    label:"2",
    //当前标签是否显示
    show:true,
    description:"aaaaaaaaaa关于本点的描述，关于本点的描述，关于本点的描述，关于本点的描述，关于本点的描述，关于本点的描述，关于本点的描述，关于本点的描述。",
    position:new THREE.Vector3(0,2.2,4.2),
    style:{
      x:0,
      y:0
    }
  },{
    label:"3",
    //当前标签是否显示
    show:true,
    description:"aaaaaaaaaa关于本点的描述，关于本点的描述，关于本点的描述，关于本点的描述，关于本点的描述，关于本点的描述，关于本点的描述，关于本点的描述。",
    position:new THREE.Vector3(-4.2,2.2,0),
    style:{
      x:0,
      y:0
    }
  },{
    label:"4",
    //当前标签是否显示
    show:true,
    description:"cccccccc关于本点的描述，关于本点的描述，关于本点的描述，关于本点的描述，关于本点的描述，关于本点的描述，关于本点的描述，关于本点的描述。",
    position:new THREE.Vector3(0,2.2,-4.2),
    style:{
      x:0,
      y:0
    }
  }
])

onMounted(()=>{
  threeIns =new CubeScene({
    infoList:infoList.value,
    alwaysShow:false
  });
  /**
   * 当标签的位置需要变化时
   * @param index   标签下标
   * @param p       位置参数
   */
  threeIns.itemPositionChange=(index,p)=>{
    infoList.value[index].style.x=p.x - 10;
    infoList.value[index].style.y=p.y - 20;
  }
  /**
   * 某个标签的是否可见发生了变化
   * @param index
   * @param show
   */
  threeIns.visibleChange=(index,show)=>{
    infoList.value[index].show=show;
  }
})
</script>

<style lang="less" scoped>
#cubeDemo{
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  //background: #42b983;

  .infoItem{
    position: absolute;
    left: 50%;
    top:50%;
    transition: all 0.2s;
    .label{
      transform: scale(0.1);
      opacity: 0;
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

    }
    .des{
      background: rgba(0,0,0,0.5);
      padding: 6px;
      border-radius: 8px;
      margin: 10px;
      color: white;
      max-width: 400px;
      border: 1px solid #eeeeee;
      transform: translateX(-50%);
      opacity: 0;
      display: none;
      transition: all 0.25s;
    }
  }

  .infoItem:hover .des{
    //background: red;
    //.des{
    display: block;
    opacity: 1;
    //}
  }


  .visible{
    .label{
      transform: scale(1);
      opacity: 1;
    }
  }
}
</style>