<template>
  <div id="RootContainer"></div>
</template>
<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader';
import {onMounted, onUnmounted} from "vue";
import * as THREE from "three";
import Stats from 'stats-js';


let mapIns;


var camera;
var renderer;
var scene;
var meshes = [];

// 数据转换工具
var customCoords;
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
      zoom: 17,
      viewMode: '3D',
      pitch: 50,
    });

    console.log(mapIns,"实例")

    // mapIns.setFeatures(['bg', 'road', 'building']);


    // 数据转换工具
    customCoords = mapIns.customCoords;
    // 数据使用转换工具进行转换，这个操作必须要提前执行（在获取镜头参数 函数之前执行），否则将会获得一个错误信息。
    var data = customCoords.lngLatsToCoords([
      [116.52, 39.79],
      [116.54, 39.79],
      [116.56, 39.79],
    ]);
    console.log("转换后",data)
    initThree(AMap, data)
  }).catch(e => {
    console.log(e);
  })
}


function initThree(AMap, data) {

  // 创建 GL 图层
  let gllayer = new AMap.GLCustomLayer({
    // 图层的层级
    zIndex: 30,
    // 初始化的操作，创建图层过程中执行一次。
    init: (gl) => {
      // 这里我们的地图模式是 3D，所以创建一个透视相机，相机的参数初始化可以随意设置，因为在 render 函数中，每一帧都需要同步相机参数，因此这里变得不那么重要。
      // 如果你需要 2D 地图（viewMode: '2D'），那么你需要创建一个正交相机
      camera = new THREE.PerspectiveCamera(60, 500 / 500, 100, 1 << 30);

      renderer = new THREE.WebGLRenderer({
        context: gl,  // 地图的 gl 上下文
        // alpha: true,
        // antialias: true,
        // canvas: gl.canvas,
      });

      // 自动清空画布这里必须设置为 false，否则地图底图将无法显示
      renderer.autoClear = false;
      scene = new THREE.Scene();

      // 环境光照和平行光
      var aLight = new THREE.AmbientLight(0xffffff, 0.8);
      var dLight = new THREE.DirectionalLight(0xffffff, 1);
      dLight.position.set(1000, -100, 900);
      scene.add(dLight);
      // scene.add(aLight);


      var texture = new THREE.TextureLoader().load('https://a.amap.com/jsapi_demos/static/demo-center-v2/three.jpeg');
      texture.minFilter = THREE.LinearFilter;
      //  这里可以使用 three 的各种材质
      var mat = new THREE.MeshPhongMaterial({
        color: 0xfff0f0,
        depthTest: true,
        transparent: true,
        map: texture,
      });
      var geo = new THREE.BoxGeometry(100, 100, 100);
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        var mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(d[0], d[1], 30);
        meshes.push({
          mesh,
          count: i,
        });
        scene.add(mesh);
      }
    },
    render: () => {
      // 这里必须执行！！重新设置 three 的 gl 上下文状态。
      renderer.resetState();
      // 重新设置图层的渲染中心点，将模型等物体的渲染中心点重置
      // 否则和 LOCA 可视化等多个图层能力使用的时候会出现物体位置偏移的问题
      customCoords.setCenter([116.52, 39.79]);
      var {near, far, fov, up, lookAt, position} = customCoords.getCameraParams();

      // 2D 地图下使用的正交相机
      // var { near, far, top, bottom, left, right, position, rotation } = customCoords.getCameraParams();

      // 这里的顺序不能颠倒，否则可能会出现绘制卡顿的效果。
      camera.near = near;
      camera.far = far;
      camera.fov = fov;
      camera.position.set(...position);
      camera.up.set(...up);
      camera.lookAt(...lookAt);
      camera.updateProjectionMatrix();

      // 2D 地图使用的正交相机参数赋值
      // camera.top = top;
      // camera.bottom = bottom;
      // camera.left = left;
      // camera.right = right;
      // camera.position.set(...position);
      // camera.updateProjectionMatrix();

      renderer.render(scene, camera);

      // 这里必须执行！！重新设置 three 的 gl 上下文状态。
      renderer.resetState();
    },
  });

  mapIns.add(gllayer);
}

const clock = new THREE.Clock();


// 动画
function animate() {
  stats?.update();
  for (let i = 0; i < meshes.length; i++) {
    let {mesh, count} = meshes[i];
    mesh.rotation.z = clock.getElapsedTime()
  }
  mapIns?.render();
  requestAnimationFrame(animate);
}

animate();

onMounted(() => {
  initStats();
  initMap()
})

onUnmounted(()=>{
  stats.domElement.parentNode.removeChild(stats.domElement);
  mapIns.destroy();
})

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
// window.addEventListener('resize', onWindowResize);
</script>
<style scoped lang="less">
#RootContainer {
  padding: 0px;
  margin: 0px;
  width: 500px;
  height: 500px;
}
</style>