<template>
  <div id="RootContainer"></div>
</template>
<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader';
import {onMounted, onUnmounted} from "vue";
import {GMapRender} from "./hooks";

let stats;
let threeIns:GMapRender;
let mapIns:any;

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
      zoom: 17,
      viewMode: '3D',
      pitch: 50,
    });

    threeIns=new GMapRender(mapIns,[116.54, 39.79],AMap)

    console.log(mapIns,"实例")


  }).catch(e => {
    console.log(e);
  })
}


onMounted(() => {
  initMap()
})

onUnmounted(()=>{
  // stats.domElement.parentNode.removeChild(stats.domElement);
  mapIns.destroy();
  threeIns.destroy();
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