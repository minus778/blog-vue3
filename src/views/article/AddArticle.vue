<template>
    <div class="addArticle">
        <h2 class=topTitle>{{  $route.query.editArticleId ? '编辑文章' : '写文章'  }}</h2>
        <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="auto" class="demo-ruleForm">
            <el-form-item prop="title">
                <el-input v-model="formData.title" placeholder="标题" maxlength="60" show-word-limit type="text"
                    :prefix-icon="EditPen" />
            </el-form-item>
            <div class="choose-select">
                <el-form-item prop="selectCategoryList" :style="{ width: '49%' }">
                    <el-cascader v-model="formData.selectCategoryList" :options="selectCategory" placeholder="选择分类"
                        style="width: 100%;" clearable>
                        <template #default="{ node, data }">
                            <el-tag class="ml-2"
                                :style="{ color: data.color, backgroundColor: colorRgb(data.color, 0.1), border: `1px solid ${colorRgb(data.color, 0.2)}`, whiteSpace: 'wrap' }">
                                {{
                                 data.value 
                                }}
                            </el-tag>
                        </template>
                    </el-cascader>
                </el-form-item>
                <el-form-item prop="selectTagList" :style="{ width: '49%' }">
                    <el-cascader v-model="formData.selectTagList" :options="selectTag" placeholder="选择标签"
                        style="width: 100%;" clearable :props="{ multiple: true }" :disabled="disabled">
                        <template #default="{ node, data }">
                            <el-tag class="ml-2"
                                :style="{ color: data.color, backgroundColor: colorRgb(data.color, 0.1), border: `1px solid ${colorRgb(data.color, 0.2)}`, whiteSpace: 'wrap' }">
                                {{
                                 data.value 
                                }}
                            </el-tag>
                        </template>
                    </el-cascader>
                </el-form-item>
            </div>
            <el-form-item prop="content">
                <mavon-editor ref="md" :autofocus="false" v-model="formData.mdContent" placeholder="写些什么呢..."
                    class="mavon" @change="getMdHtml" @imgAdd="uploadContentImg" @imgDel="delContentImg" />
            </el-form-item>
            <el-form-item prop="isShow">
                <el-switch :model-value="formData.isshow === 'true'" active-text="发布文章" inactive-text="隐藏文章"
                    @click="formData.isshow === 'true' ? formData.isshow = 'false' : formData.isshow = 'true'" />
            </el-form-item>
        </el-form>
        <div class="btn">
            <el-button type="primary" :loading="isSubmit === 1" class="submit" @click="submitArticle(ruleFormRef)">
                {{  $route.query.editArticleId ? '完成编辑' : '发布文章'  }}
            </el-button>
            <el-button type="danger" class="clear" @click="clearForm">清空
            </el-button>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { EditPen } from '@element-plus/icons-vue'
import useAddArticle from '@/composables/article/addArticle/useAddArticle';
import useAddArticleBase from '@/composables/article/addArticle/useAddArticleBase';
import useAddArticleMavon from '@/composables/article/addArticle/useAddArticleMavon';
import useColor from '@/hooks/useColor'
const { colorRgb } = useColor()

//新增/编辑文章页基础共用数据及逻辑
const { ruleFormRef, formData, submitForm, disabled, isSubmit, articleList, categoryList, tagList, userName, selectCategory, selectTag, rules, clearForm } = useAddArticleBase()
//新增/编辑文章页表单提交逻辑
const { submitArticle } = useAddArticle(submitForm, formData, isSubmit, userName, tagList, articleList, categoryList, clearForm)
//新增/编辑文章页编辑器部分
const { md, getMdHtml, uploadContentImg, delContentImg } = useAddArticleMavon(formData)

</script>

<style scoped lang='scss'>
.addArticle {
    padding: 20px;

    .topTitle {
        margin-bottom: 10px;
    }

    .choose-select {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .mavon {
        width: 100%;
        height: 500px;
    }

    .btn {

        .submit,
        .clear {
            width: 200px;
        }
    }
}
</style>