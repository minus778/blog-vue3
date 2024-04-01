<template>
    <div class="about">
        <mavon-editor ref="md" v-model="mdContent" placeholder="写些什么呢..." class="mavon" @change="getMdHtml"
            @imgAdd="uploadContentImg" @imgDel="delContentImg" />
        <el-button type="primary" :loading="isSubmit === 1" class="submit" @click="editAbout">发布
        </el-button>
    </div>
</template>

<script setup lang='ts'>
import useAbout from '@/composables/website/about/useAbout';

import useAboutMavon from '@/composables/website/about/useAboutMavon';

//关于页整体数据及逻辑
const { isSubmit, mdContent, htmlContent, uploadImgList, editAbout } = useAbout()
//关于页编辑器部分
const { md, getMdHtml, uploadContentImg, delContentImg } = useAboutMavon(mdContent, htmlContent, uploadImgList)

</script>

<style scoped lang='scss'>
.about {
    padding: 20px;

    .mavon {
        width: 100%;
        height: 500px;
        margin-bottom: 30px;
    }

    .submit {
        width: 200px;
    }
}
</style>