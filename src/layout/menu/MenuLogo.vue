<template>
    <div class="logo" :class="{ isShow: !show }">
        <img src="@/assets/imgs/logo.png" />
        <div v-if="show" class="logo-title">{{ name }}博客后台</div>
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
const props = defineProps({
    collapsed: {
        type: Boolean,
        required: true
    },
    name: {
        type: String,
        required: true,
        default: 'haixtx'
    }
})
const show = ref<boolean>(true)
watch(
    () => props.collapsed,
    (collapsed: boolean) => {
        if (!collapsed) {
            //文字延时显示，和菜单文字同步
            setTimeout(() => {
                show.value = !collapsed
            }, 300)
        } else {
            show.value = !collapsed
        }
    }
)
</script>

<style lang="scss" scoped>
@import '@/assets/css/controller.scss';

.logo {
    display: flex;
    width: 100%;
    height: 100px;
    line-height: 100px;
    background: white;
    text-align: center;
    cursor: pointer;
    align-items: center;
    transition: all 0.3s linear;

    img {
        width: 60px;
        height: 60px;
        margin-right: 12px;
        margin-left: 20px;
        transition: all 0.3s linear;
    }

    .logo-title {
        display: inline-block;
        margin: 0;
        color: $textColor;
        font-weight: 600;
        font-size: 20px;
        line-height: 100px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        vertical-align: middle;
    }
}

.isShow {
    height: 50px;
    line-height: 50px;

    img {
        width: 32px;
        height: 32px;
    }

    .logo-title {
        line-height: 50px;
    }
}
</style>