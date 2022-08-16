<template>
    <div class="websiteMes">
        <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="auto" class="demo-ruleForm"
            status-icon>
            <el-form-item prop="avatar" label="头像" class="avatars">
                <el-upload :headers="{ contentType: 'multipart/form-data' }" :show-file-list="false"
                    :action="formData.websiteAddress + '/api/uploadImg'" :on-success="uploadImg" :on-error="uploadFail">
                    <div class="avatar">
                        <div class="avatar-item">
                            <img :src="formData.websiteAddress + formData.avatar" alt="" />
                        </div>
                    </div>
                </el-upload>
            </el-form-item>
            <el-form-item prop="name" label="昵称">
                <el-input v-model="formData.name" placeholder="昵称" maxlength="20" type="text" />
            </el-form-item>
            <el-form-item prop="password" label="密码">
                <el-input v-model="formData.password" placeholder="密码" maxlength="20" type="text" />
            </el-form-item>
            <el-form-item prop="introduce" label="网站介绍">
                <el-input v-model="formData.introduce" placeholder="网站介绍" maxlength="40" type="text" />
            </el-form-item>
            <el-form-item prop="desc" label="网站描述">
                <el-input v-model="formData.desc" placeholder="网站描述" maxlength="40" type="text" />
            </el-form-item>
            <el-form-item prop="github" label="github">
                <el-input v-model="formData.github" placeholder="github" maxlength="40" type="text" />
            </el-form-item>
            <el-form-item prop="gitee" label="gitee">
                <el-input v-model="formData.gitee" placeholder="gitee" maxlength="40" type="text" />
            </el-form-item>
            <el-form-item prop="recode" label="网站备案号">
                <el-input v-model="formData.recode" placeholder="网站备案号" maxlength="40" type="text" />
            </el-form-item>
            <el-form-item prop="websiteAddress" label="网站后端URL">
                <el-input v-model="formData.websiteAddress" placeholder="网站后端URL" maxlength="40" type="text" />
            </el-form-item>
        </el-form>
        <el-button type="primary" :loading="isSubmit === 1" class="submit" @click="submitForm(ruleFormRef)">提交
        </el-button>
    </div>
</template>

<script setup lang='ts'>
import useBaseMes from '@/composables/website/message/useBaseMes'
import useMes from '@/composables/website/message/useMes'

//基础数据
const { ruleFormRef, isSubmit, formData, blogMes, rules, delAvatar } = useBaseMes()
//逻辑操作
const { uploadImg, uploadFail, submitForm } = useMes(formData, blogMes, delAvatar)


</script>

<style scoped lang='scss'>
.websiteMes {
    padding: 20px;

    .avatars {

        .avatar {
            width: 110px;
            height: 110px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: gainsboro;
            cursor: pointer;

            .avatar-item {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                overflow: hidden;
            }

            img {
                width: 100%;
                height: 100%;
            }
        }
    }

    .submit {
        width: 200px;
        margin-top: 20px;
        margin-left: 105px;
    }
}
</style>