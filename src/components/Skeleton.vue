<!-- 骨架屏组件 -->
<template>
  <div class="xtx-skeleton" :style="{ width:props.width, height:props.height }" :class="{ shan: animated }">
    <!-- 盒子-->
    <div class="block" :style="{ backgroundColor: props.bg }"></div>
  </div>
</template>

<script setup lang="ts">
//接收父组件传递的参数
//withDefaults:设置默认值
// 使用的时候需要动态设置 高度，宽度，背景颜色，是否闪下
const props = withDefaults(defineProps<{
  //设置背景颜色
  bg?: string,
  //设置宽度
  width: string,
  //设置高度
  height: string,
  //是否开启动画效果（闪动）
  animated: boolean
}>(), {
  bg: "#efefef",
  width: "100px",
  height: "100px",
  animated: true
})
</script>

<style scoped lang="scss">
.xtx-skeleton {
  display: inline-block;
  position: relative;
  overflow: hidden;
  vertical-align: middle;

  .block {
    width: 100%;
    height: 100%;
    border-radius: 2px;
  }
}

.shan {
  &::after {
    content: "";
    position: absolute;
    animation: shan 1.5s ease 0s infinite;
    top: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(to left,
        rgba(255, 255, 255, 0) 0,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0) 100%);
    transform: skewX(-45deg);
  }
}

@keyframes shan {
  0% {
    left: -100%;
  }

  100% {
    left: 120%;
  }
}
</style>