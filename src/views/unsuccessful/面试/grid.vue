<template>
<div class="root">
  <div :class="['item','item'+item]" v-for="item in 20">{{item}}</div>
</div>
</template>

<script>
export default {
  name: "index"
}
</script>

<style lang="less" scoped>
.root{
  width: 580px;
  height: 400px;
  background: #42b983;
  display: grid;
  grid-template-columns:repeat(5,1fr);
  grid-template-areas: 'f f a s s'
                       'v v b b b'
                       'm m m m m'
                       'c c c c c';
  //grid-auto-flow: column;
  grid-gap: 10px;
  padding: 10px;
  .item{
    background: #304455;
    display: flex;
    justify-content: center;
    align-items: center;
    color: red;
  }
  //.item:nth-child(2),.item:nth-child(5){
  //  background: red;
  //  grid-area: v;
  //}
  //
  //.item:nth-child(7),.item:nth-child(10){
  //  background: gold;
  //  grid-area: s;
  //}
  //.item:nth-child(1),.item:nth-child(3){
  //  background: gold;
  //  grid-area: f;
  //}

  .item1{
    background: #67b5ff;
    grid-row: 2 / 4 ;
    grid-column: 3 / 5;
  }


  .item2{
    background: #f5ff67;
    grid-row: 2 / 5 ;
    //grid-column: 3 / 5;
  }

  .item3{
    background: #e300d0;
    //grid-row: 2 / 5 ;
    grid-column: 1 / 5;
  }
  .item4{
    grid-column: 2 / 5;
    grid-row: 6 / 7 ;
    background: #00ff0f;
  }

  //.item14{
  //  background: #f5ff67;
  //  //grid-row: 2 / 5 ;
  //  grid-column: 3 / 5;
  //}
  //.item:nth-child(4),
  //.item:nth-child(6),
  //.item:nth-child(13),
  //.item:nth-child(18){
  //  background: gold;
  //  grid-area: x;
  //}

  //.item:nth-child(7),.item:nth-child(8),.item:nth-child(9){
  //  background: gold;
  //  //grid-area: s;
  //}
}
</style>