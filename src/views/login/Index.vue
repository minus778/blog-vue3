<template>
    <div class="logincontainer">
        <div class="img">
            <img class="one" src="@/assets/imgs/login0.png" alt="" v-show="loginImg === 'one'" />
            <img class="two" src="@/assets/imgs/login1.png" alt="" v-show="loginImg === 'two'" />
            <img class="three" src="@/assets/imgs/login2.png" alt="" v-show="loginImg === 'three'" />
        </div>
        <el-form class="loginForm" :model="formLabel" ref="loginFormRef" :rules="rules" :inline="false">
            <el-form-item>
                <div class="loginTitle">Welcome Home!</div>
            </el-form-item>
            <el-form-item prop="name">
                <el-input placeholder="请输入用户名" v-model="formLabel.name" @focus="loginImg = 'two'"
                    @blur="loginImg = 'one'">
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input placeholder="请输入密码" type="password" v-model="formLabel.password" @focus="loginImg = 'three'"
                    @blur="loginImg = 'one'">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="mybtn" type="primary" size="default" @click="login">SIGN IN</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang='ts'>
import useBaseLogin from '@/composables/login/useBaseLogin'
import useLogin from '@/composables/login/useLogin'

const { loginImg, loginFormRef, formLabel, rules } = useBaseLogin()
const { login } = useLogin(formLabel)

</script>

<style scoped lang='scss'>
@import '@/assets/css/controller.scss';

.logincontainer {
    position: relative;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        img {
            position: relative;
            width: 100px;
        }

        .one {
            top: -160px;
        }

        .two {
            top: -157px;
        }

        .three {
            top: -155px;
        }
    }

    .loginForm {
        height: 270px;
        width: 350px;
        border-radius: 10px;
        padding: 20px 35px;
        box-shadow: 0 0 25px #cac6c6;

        .loginTitle {
            font-size: 20px;
            font-weight: 600;
            color: $textColor;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .mybtn {
            width: 100%;
        }


        .el-input {
            height: 37px;
        }
    }
}
</style>