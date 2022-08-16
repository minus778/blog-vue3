<!-- echarts图表通用模板组件 -->
<template>
    <div>
        <div ref="commonEchartRef" :style="{ height: height, width: width }"></div>
    </div>
</template>
<script setup lang='ts'>
import { ref, onMounted, watchEffect, computed, watch } from 'vue'
import { useStore } from '@/store'
import useEcharts from '@/hooks/useEcharts';
const store = useStore()
//获取菜单按钮是否点击
const isclickBtn = computed(() => {
    return store.state.menu.collapse
})
//接收父组件传递的参数
//withDefaults:设置默认值
const props = withDefaults(defineProps<{
    width?: string,
    height: string,
    optios: any
}>(), {
    width: '100%',
    height: '360px'
})
//定义ref属性
const commonEchartRef = ref<HTMLElement>()
onMounted(() => {
    //叹号：断定commonEchartRef.value存在
    const { setOptions, resize } = useEcharts(commonEchartRef.value!)
    watchEffect(() => {
        setOptions(props.optios)
    })
    //监听到菜单按钮被点击就修改图表大小实现响应式
    watch(isclickBtn, () => {
        //延迟0.3s让父盒子宽度固定后再计算宽度
        setTimeout(() => {
            resize();
        }, 300)
    })
    //自适应-页面大小修改图表响应式更改
    window.addEventListener('resize', () => {
        resize();
    })
})

</script>
<style scoped lang='scss'>
</style>