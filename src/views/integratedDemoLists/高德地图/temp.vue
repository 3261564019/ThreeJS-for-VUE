<template>
  <div id="RootContainer"></div>
</template>
<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader';
import {onMounted} from "vue";
import Stats from 'stats-js';


let mapIns;
let stats;

function  initStats() {
  //实例化
  stats = new Stats();
  //setMode参数如果是0，监测的是FPS信息，如果是1，监测的是渲染时间
  stats.setMode(0);
  //把统计面板放到左上角
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  stats.domElement.style.left = '0px';
  //添加到body里
  document.body.appendChild(stats.domElement);

}

function initMap() {
  AMapLoader.load({
    key: "307b9b2fe6d626c13dc963dc24bd60e0",             // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    // plugins: ['AMap.Marker', "AMap.TileLayer", "AMap.Buildings", "AMap.TileLayer.WMS"],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  }).then((AMap) => {
    console.log(AMap)

    // let satellite = new AMap.TileLayer.Satellite();

    // let buildings = new AMap.Buildings({
    //   'zooms': [16,18],
    //   'zIndex': 10,
    //   'heightFactor': 2 // 2 倍于默认高度（3D 视图下生效）
    // });

    mapIns = new AMap.Map("RootContainer", {  //设置地图容器id
      center: [116.54, 39.79],
      zooms: [2, 20],
      zoom: 14,
      viewMode: '3D',
      pitch: 50,
    });

    // initThree(AMap, data)
  }).catch(e => {
    console.log(e);
  })
}




// 动画
function animate() {
  stats?.update();
  requestAnimationFrame(animate);
}

animate();

onMounted(() => {
  initMap();
  initStats()
})

</script>
<style scoped lang="less">
#RootContainer {
  padding: 0px;
  margin: 0px;
  width: 500px;
  height: 500px;
}
</style>