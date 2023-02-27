<template>
<div class="vr-root">

<!--  <div class="video-source" id="webcam">-->

<!--  </div>-->

  <video width="500" height="500" id="videoTest" controls autoplay></video>
</div>
</template>

<script setup>
import {onMounted} from "vue";

async function setupWebcam() {
  return new Promise( ( resolve, reject ) => {
    const webcamElement = document.getElementById( "webcam" );
    const videoTest = document.getElementById( "videoTest" );
    const navigatorAny = navigator;
    console.log(navigator)

    navigator.mediaDevices.getUserMedia({ audio: false, video: true })
        .then(function(stream) {
          /* 使用这个 stream stream */
          console.log("流",stream)
          // webcamElement.srcObject = stream;
          videoTest.srcObject=stream;
          // webcamElement.addEventListener( "loadeddata", resolve, false );
        })
        .catch(function(err) {
          /* 处理 error */
          console.log("失败",err)
        });
    // navigator.getUserMedia = navigator.getUserMedia ||
    //     navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
    //     navigatorAny.msGetUserMedia;
    // if( navigator.getUserMedia ) {
    //   navigator.getUserMedia( { video: true },
    //       stream => {
    //         webcamElement.srcObject = stream;
    //         webcamElement.addEventListener( "loadeddata", resolve, false );
    //       },
    //       error => reject());
    // }
    // else {
    //   reject();
    // }
  });
}


onMounted(()=>{
  setupWebcam();
})

</script>

<style lang="less" scoped>
.vr-root{
  //.video-source{
  //  width: 500px;
  //  height: 500px;
  //  border: 1px solid #42b983;
  //}
}
</style>