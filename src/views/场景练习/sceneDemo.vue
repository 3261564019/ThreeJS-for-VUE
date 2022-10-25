<template>
<div id="sceneDemo">

</div>
</template>

<script name="sceneDemo" setup>
import {onMounted} from "vue";
import {SceneDemo} from "./js/SceneDemo";

let ins=null;

onMounted(()=>{
  ins=new SceneDemo({})
})
</script>

<style scoped>

</style>