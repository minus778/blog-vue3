<template>
  <!-- 一级路由 -->
  <!-- 解决分页英文问题 -->
  <el-config-provider :locale="zhCn">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </el-config-provider>
</template>

<script setup lang='ts'>
// import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { onMounted } from 'vue';
import { useStore } from '@/store'
const store = useStore()
const token = localStorage.getItem('blogToken')
//初始化仓库数据
onMounted(() => {
  //如果token存在即处于登录状态就发请求获取对应数据
  if (token) {
    getStoreMes()
  }
})
//获取文章列表、标签列表、分类列表数据、评论(不要加await，四个请求同步，使用HTTP2同步发请求会减少请求时间，使用await会让四个请求一个一个来)
const getStoreMes = () => {
  store.dispatch('articles/getArticleList')
  store.dispatch('categories/getCategoriesList')
  store.dispatch('tags/getTagList')
  store.dispatch('comments/getCommentList')
}
</script>

<style scoped lang='scss'></style>
