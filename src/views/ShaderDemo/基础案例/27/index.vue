<template>
  <div class="shader-root" id="shaderRoot">

  </div>
</template>
<script setup lang="ts">
import {onMounted} from "vue";
import {BaseScene} from "./BaseScene";
import videoFile from "@/assets/img/wall/video.mp4"
import {Texture} from "three";

let ins:BaseScene;
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
//视频的时长
let duration=0;
let video:HTMLVideoElement;
let size={
  width:0,
  height:0
}

let initVideo=()=>{
  video = document.createElement('video');
  video.src = videoFile;
  video.className="testVideo"
  video.crossOrigin = 'anonymous';
  video.controls=true
  video.load();
  video.addEventListener('loadedmetadata', ()=>{
    duration=video.duration;
    size.width = video.videoWidth;
    size.height = video.videoHeight;
    console.log("siez",size)
    // console.log('Video duration: ', video.duration, ' seconds')
  })
  video.addEventListener('seeked', ()=>{
    console.log("seeked")
    createImage()
  });
  // document.body.appendChild(video);
}

let createImage=()=>{
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const texture = new Texture(canvas);
  texture.needsUpdate = true;
  ins.setTrack(texture)
}

let videoRateChange=(e:number)=>{
  let t=duration * e
  video.currentTime=t;
  // console.log("进度",e)
  // console.log("时间",t)
}


onMounted(()=>{
  initVideo()

  ins=new BaseScene()
  ins.videoRateChange=videoRateChange;
})
</script>
<script lang="ts">
export default {
  name: "index.vue"
}
</script>
<style lang="less">
@keyframes rotateGradient {
  from {
    background-image: linear-gradient(0deg, #6f86f7 0%, #c563bf 30%, #eeb750 66%, #ffffff 100%);
  }
  to {
    background-image: linear-gradient(360deg, #6f86f7 0%, #c563bf 30%, #eeb750 66%, #ffffff 100%);
  }
}

.shader-root{
  width: 100vw;
  height: 100vh;
  background-color: #000;
  //background: url("@/assets/img/house.png");
  //background-image: linear-gradient(45deg, #6f86f7 0%, #c563bf 30%, #eeb750 66%, #ffffff 100%);
  //animation: rotateGradient 10s linear infinite; /* 定义动画：持续10秒，线性变化，无限循环 */
}
.testVideo{
  width: 400px;
  //position: fixed;
  top: 500px;
  left: 0;
}
</style>