<template>
  <div class="sbRoot">
    <div class="header">header</div>
    <div class="content">
      <div class="center"> center</div>
      <div class="left">left</div>
      <div class="right">right</div>
    </div>
    <div class="footer">
      footer
    </div>
  </div>
</template>

<script>
export default {
  name: "圣杯布局"
}
</script>

<style lang="less" scoped>
.sbRoot{
  min-width: 800px;
  .header{
    height: 50px;
    background: #42b983;
  }
  .footer{
    height: 50px;
    width: 100%;
    background: #67b5ff;
  }
  .content{
    background: #b16ef3;
    height:200px;
    padding-left: 300px;
    padding-right: 200px;
    div{
      height:200px;
      float: left;
    }
    .left{
      width: 300px;
      background: #ff7fa0;
      margin-left: -100%;
      position: relative;
      left: -300px;
    }
    .right{
      width: 200px;
      margin-left: -200px;
      background: #77ff2f;
      position: relative;
      right: -200px;
    }
    .center{
      width: 100%;
      background: #304455;
    }
  }
}
</style>