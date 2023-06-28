<template>
  <div id="RootContainer"></div>
  <canvas id="Canvas"></canvas>"
</template>
<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader';
import {onMounted, onUnmounted} from "vue";
import {GMapRender} from "./hooks";
import testCpn from "@/components/test.vue";
import {MakerWithCmp} from "./types/Gmap";

let stats;
let threeIns:GMapRender;
let mapIns:any;

let markerCpmMap=new Map<number,MakerWithCmp>();

function addMarker() {
  // 添加标记点
  const icon = new AMap.Icon({
    size: new AMap.Size(25, 34),
    image: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png',
    imageSize: new AMap.Size(25, 34)
  });
  const marker = new AMap.Marker({
    icon: icon,
    position:[116.38952353003309,39.92581257536286],
    offset: new AMap.Pixel(-12, -28),
  });
  console.log("marker.target._amap_id",)
  //@ts-ignore
  markerCpmMap.set(marker._amap_id,{marker,cmp:testCpn,state:null})

  marker.setMap(mapIns);

  marker.on('click', (e) => {
    let id=e.target._amap_id
    let item=markerCpmMap.get(id)
    //@ts-ignore
    if(item.state==="opening"){
      return
    }
    threeIns.openInfoWindow(item)
  });
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

    let center= [116.38922353003309,39.92581257536286]

    mapIns = new AMap.Map("RootContainer", {  //设置地图容器id
      center,
      zooms: [2, 20],
      zoom: 17,
      viewMode: '3D',
      mapStyle: 'amap://styles/grey',
      pitch: 50,
    });

    addMarker()
    //
    // let aaa=mapIns.customCoords.lngLatsToCoords([
    //   [116.38922453003309, 39.92581257536286],
    // ])
    // console.log("aaa",aaa)
    //
    // setTimeout(()=>{
    //   let b=mapIns.customCoords.lngLatsToCoords([
    //     [116.38922453003309, 39.92581257536286],
    //   ])
    //   console.log("bbb",b)
    // },100)

    threeIns=new GMapRender(mapIns,center,AMap)
    console.log(mapIns,"实例")

  }).catch(e => {
    console.log(e);
  })
}

onMounted(() => {
  initMap()
  // initCanvas()
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
#Canvas{
  width:500px;
  height:200px;
  //background: #fff;
}
</style>
<style lang="less">
#RootContainer {
 .amap-copyright,.amap-logo{
    display: none;
   opacity: 0;
   user-select: none;
  }
  .amap-icon{
    user-select: none;
  }
}
</style>