<template>
  <div class="test vue-root">
    sss
  </div>
</template>
<script setup lang="ts">

function getRandomColor() {
  // 生成随机的RGB颜色值
  const r = Math.floor(Math.random() * 256); // 红色分量
  const g = Math.floor(Math.random() * 256); // 绿色分量
  const b = Math.floor(Math.random() * 256); // 蓝色分量

  // 判断亮度是否过高（过于接近白色）
  // 这里使用简单的判断条件，如果需要更精确的判断可以考虑使用颜色空间转换等方法
  if ((r + g + b) > 540) {
    return getRandomColor(); // 递归调用自身，重新生成颜色
  }

  // 返回格式化后的颜色值，以十六进制表示
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}


/**
 * isCover需要在其内容的前面
 * @param inputArray
 * @return {[]}
 */
function processArray(inputArray) {
  let result = [];
  let currentNum = 0;
  let currentLetter = 'A';
  let currentColor = null;

  for (let i = 0; i < inputArray.length; i++) {
    const item = inputArray[i];

    if(i==0 && !item.isCover){
      item.isCover=true
    }

    if (item.isCover) {
      currentNum++; // 更新封面编号
      currentLetter = 'A'; // 每次遇到封面对象，重置字母为 'A'

      currentColor = getRandomColor();
      result.push({
        ...item,
        num: `${currentNum}${currentLetter}`,
        color: currentColor
      });

    } else {
      currentLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 1); // 非封面对象，字母递增

      result.push({
        ...item,
        num: `${currentNum}${currentLetter}`,
        color: currentColor
      });

    }
  }

  return result;
}

// 示例用法
let temp =[
  {
    "recResult": {
      "isLast": true,
      "dogEarType": 0,
      "degree": 0,
      "hasDogEar": false,
      "dirty": 0
    },
    "image": "/sdcard/qiren/Doc1691899733_-4.jpg",
    "index": -4,
    "isCover": true
  },
  {
    "recResult": {
      "isLast": true,
      "dogEarType": 0,
      "degree": 0,
      "hasDogEar": false,
      "dirty": 0
    },
    "image": "/sdcard/qiren/Doc1691899733_4.jpg",
    "index": 4
  },
  {
    "recResult": {
      "isLast": false,
      "dogEarType": 0,
      "degree": 0,
      "hasDogEar": false,
      "dirty": 0
    },
    "image": "/sdcard/qiren/Doc1691899732_-3.jpg",
    "index": -3
  },
  {
    "recResult": {
      "isLast": false,
      "dogEarType": 0,
      "degree": 0,
      "hasDogEar": false,
      "dirty": 0
    },
    "image": "/sdcard/qiren/Doc1691899731_-2.jpg",
    "index": -2,
    "isCover": true
  },
  {
    "recResult": {
      "isLast": false,
      "dogEarType": 0,
      "degree": 0,
      "hasDogEar": false,
      "dirty": 0
    },
    "image": "/sdcard/qiren/Doc1691899730_2.jpg",
    "index": 2
  },
  {
    "recResult": {
      "isLast": false,
      "dogEarType": 0,
      "degree": 0,
      "hasDogEar": false,
      "dirty": 0
    },
    "image": "/sdcard/qiren/Doc1691899729_-1.jpg",
    "index": -1
  }
]
/**
 * 加了reverse的执行结果是  d e f a b c
 * 不加就有问题
 */
let t=processArray(temp );
console.log("??",JSON.parse(JSON.stringify(t)));
t.reverse()
console.log("反转",t)

let arr = [5, 2, 3, 2, 5];
const reversedIndex = arr.slice().reverse().findIndex((element) => element == 5);
// 转换为正向下标
const result = reversedIndex >= 0 ? arr.length - 1 - reversedIndex : -1;
console.log(result); // 输出: 3




let a=[
  {
    "isCover": true,
    "num": "1A",
    "color": "#141c0"
  },
  {
    "num": "1B",
    "color": "#141c0"
  },
  {
    "num": "1C",
    "color": "#141c0"
  },
  {
    "isCover": true,
    "num": "2A",
    "color": "#243c0"
  },
  {
    "num": "2B",
    "color": "#243c0"
  },
  {
    "num": "2C",
    "color": "#243c0"
  },
  {
    "num": "2D",
    "color": "#243c0"
  }
]

</script>
<script lang="ts">
export default {
  name: "test.vue"
}
</script>
<style lang="scss" scoped>

</style>