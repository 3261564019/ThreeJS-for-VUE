<template>
  <div class="wrapper">
    <div class="item" v-for="i in 12">{{i}}</div>
  </div>
</template>
<script setup lang="ts">
</script>
<script lang="ts">
export default {
  name: "flex.vue"
}
</script>
<style lang="less" scoped>
.wrapper{
  border: 2px solid red;
  display: flex;
  flex-wrap: wrap;

  .item{
    width: 100px;
    height: 100px;
    //flex-shrink: 1;
    //margin: 0 4px 4px 0;
    flex-grow: 1;
    background: #6f86f7;
    border: 1px solid #0f0;
    &:nth-child(1){
      //flex-grow: 3;
    }
  }
}
</style>