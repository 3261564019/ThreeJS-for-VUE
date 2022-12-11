<template>
  <div class="root">
    <button @click="test">请求</button>
  </div>
</template>

<script name="test" setup>

//https://lms.ouchn.cn/api/course/activities-read/20000680501
//看视频的开始时间秒数和结束时间秒数
import axios from "axios";

let time = {
  "start": 120,
  "end": 130
}

// let cookie={
//       HWWAFSESID:"7e9fae0e84235be9ebc",
//       HWWAFSESTIME:"1668171851610",
//       _ga:"GA1.2.808722776.1668171886",
//       session:"V2-20000000002-ac889382-b7c0-4dfa-80fc-289c735d2881.MjAwMDA0Njg1ODA.1668260380047.93aaPL8jSPwPU4KthzrhUYEUC7U"
// }

document.cookie="HWWAFSESID=7e9fae0e84235be9ebc; HWWAFSESTIME=1668171851610; _ga=GA1.2.808722776.1668171886; session=V2-20000000002-ac889382-b7c0-4dfa-80fc-289c735d2881.MjAwMDA0Njg1ODA.1668260380047.93aaPL8jSPwPU4KthzrhUYEUC7U"

//https://lms.ouchn.cn/statistics/api/online-videos
let course = {
  "user_id": 20000468580,
  "org_id": 20000000002,
  "course_id": 20000008613,
  "module_id": 20000078140,
  "syllabus_id": 20000155247,
  "activity_id": 20000680501,
  "upload_id": 5355869,
  "reply_id": null,
  "comment_id": null,
  "forum_type": "",
  "action_type": "play",
  "is_teacher": false,
  "is_student": true,
  "ts": 1668174001156,
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
  "meeting_type": "online_video",
  "start_at": 120,
  "end_at": 130,
  "duration": 10,
  "master_course_id": 27687,
  "org_name": "陕西开放大学",
  "org_code": "610",
  "user_no": "1861001462529",
  "user_name": "陈露超",
  "course_code": "202209-04392610",
  "course_name": "形势与政策",
  "dep_id": "20000001223",
  "dep_name": "陕西省航空技术学校",
  "dep_code": "6109001"
}


//https://lms.ouchn.cn/statistics/api/user-visits
let visits = {
  activity_id: 20000680501,
  activity_type: "online_video",
  auto_interval: true,
  browser: "chrome",
  course_code: "202209-04392610",
  course_id: 20000008613,
  course_name: "形势与政策",
  dep_code: "6109001",
  dep_id: "20000001223",
  dep_name: "陕西省航空技术学校",
  is_teacher: false,
  master_course_id: 27687,
  org_code:
      "610",
  org_id:
      20000000002,
  org_name:
      "陕西开放大学",
  user_agent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
  user_id:
      "20000468580",
  user_name:
      "陈露超",
  user_no:
      "1861001462529",
  visit_duration:
      21,
}

let headers={
  accept:"*/*",
  cookie:"HWWAFSESID=7e9fae0e84235be9ebc; HWWAFSESTIME=1668171851610; _ga=GA1.2.808722776.1668171886; session=V2-20000000002-ac889382-b7c0-4dfa-80fc-289c735d2881.MjAwMDA0Njg1ODA.1668260380047.93aaPL8jSPwPU4KthzrhUYEUC7U"
}

function test() {
  console.log("11111")

  axios({
    method: 'post',
    url:'https://lms.ouchn.cn/api/course/activities-read/20000680501',
    data:time,
    headers
  }).then(
      res=>{
        console.log("结果",res);
      }
  )
}

</script>

<style scoped>

</style>