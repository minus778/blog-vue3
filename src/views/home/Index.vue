<template>
  <div class="container">
    <el-row :gutter="12" class="card">
      <el-col :lg="6" :sm="12" :xs="24" class="item">
        <el-card shadow="always" class="item-card">
          <div class="title">
            <span>Articles</span>
          </div>
          <div class="content">
            <div v-if="articleIsOver">
              <span>{{ articleList.length }}</span>
              <span>篇</span>
            </div>
            <Skeleton width="50px" height="30px" v-else></Skeleton>
          </div>
          <div v-if="articleIsOver">
            <div class="desc" v-if="articleList.length != 0">
              <span class="num">{{ getShortDate(articleList) }}</span>
              <span>发布了最新文章</span>
            </div>
            <div v-else class="desc">
              <span>还未发布文章~</span>
            </div>
          </div>
          <Skeleton width="140px" height="20px" v-else class="desc"></Skeleton>
        </el-card>
      </el-col>
      <el-col :lg="6" :sm="12" :xs="24" class="item">
        <el-card shadow="always" class="item-card">
          <div class="title">
            <span>Comments</span>
          </div>
          <div class="content">
            <div v-if="commentIsOver">
              <span>{{ commentList.length }}</span>
              <span>条</span>
            </div>
            <Skeleton width="50px" height="30px" v-else></Skeleton>
          </div>
          <div v-if="commentIsOver">
            <div class="desc" v-if="commentList.length != 0">
              <span class="num">{{ getShortDate(commentList) }}</span>
              <span>有人发布了最新评论</span>
            </div>
            <div v-else class="desc">
              <span>暂无评论</span>
            </div>
          </div>
          <Skeleton width="140px" height="20px" v-else class="desc"></Skeleton>
        </el-card>
      </el-col>
      <el-col :lg="6" :sm="12" :xs="24" class="item">
        <el-card shadow="always" class="item-card">
          <div class="title">
            <span>Categories</span>
          </div>
          <div class="content">
            <div v-if="categoryIsOver">
              <span>{{ categoryList.length }}</span>
              <span>个</span>
            </div>
            <Skeleton width="50px" height="30px" v-else></Skeleton>
          </div>
          <div v-if="categoryIsOver">
            <div class="desc" v-if="categoryList.length != 0">
              <span class="num">{{
              categorylatestDate >= categoryList[0].date ? getShortDate(categorylatestDate) :
              getShortDate(categoryList)
              }}</span>
              <span>更新了分类</span>
            </div>
            <div v-else class="desc">
              <span>暂无分类</span>
            </div>
          </div>
          <Skeleton width="140px" height="20px" v-else class="desc"></Skeleton>
        </el-card>
      </el-col>
      <el-col :lg="6" :sm="12" :xs="24" class="item">
        <el-card shadow="always" class="item-card">
          <div class="title">
            <span>Tags</span>
          </div>
          <div class="content">
            <div v-if="tagIsOver">
              <span>{{ tagList.length }}</span>
              <span>个</span>
            </div>
            <Skeleton width="50px" height="30px" v-else></Skeleton>
          </div>
          <div v-if="tagIsOver">
            <div class="desc" v-if="tagList.length != 0">
              <span class="num">{{ taglatestDate >= tagList[0].date ? getShortDate(taglatestDate) :
              getShortDate(tagList)
              }}</span>
              <span>更新了标签</span>
            </div>
            <div v-else class="desc">
              <span>暂无标签</span>
            </div>
          </div>
          <Skeleton width="140px" height="20px" v-else class="desc"></Skeleton>
        </el-card>
      </el-col>
    </el-row>
    <div class="echarts">
      <el-card>
        <div class="echarts-title">
          <span>Articles文章柱状图</span>
        </div>
        <CommonEcharts :optios="option1" :height="heights"></CommonEcharts>
      </el-card>
      <el-card>
        <div class="echarts-title">
          <span>Categories分类环图</span>
        </div>
        <CommonEcharts :optios="option2" :height="heights"></CommonEcharts>
      </el-card>
      <el-card>
        <div class="echarts-title">
          <span>Tags标签饼图</span>
        </div>
        <CommonEcharts :optios="option3" :height="heights"></CommonEcharts>
      </el-card>
    </div>
  </div>
</template>

<script setup lang='ts'>
import CommonEcharts from '@/components/CommonEcharts.vue';
import Skeleton from '@/components/Skeleton.vue';
import useHome from '@/composables/home/useHome'
import useHomeEchart from '@/composables/home/useHomeEchart'



const { articleList, categoryList, tagList, commentList, categorylatestDate, taglatestDate, articleIsOver, commentIsOver, categoryIsOver, tagIsOver, getShortDate } = useHome()
const { heights, option1, option2, option3 } = useHomeEchart()

</script>

<style scoped lang='scss'>
@import '@/assets/css/controller.scss';

:deep(.el-card__body) {
  padding: 10px;
}

.container {

  .skeleton {
    width: 100px;
    height: 30px;

  }

  .card {
    .item {
      .item-card {
        position: relative;
        height: 180px;
        margin-top: 10px;
        border-radius: 10px;

        .title {
          span {
            display: inline-flex;
            color: $textColor;
            border-bottom: 1px solid $textColor;
          }
        }

        .content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);

          span {
            &:nth-child(1) {
              color: $textColor;
              font-size: 32px;
              font-weight: 600;
              font-style: italic;
              margin-right: 5px;
            }

            &:nth-child(2) {
              font-size: 13px;
            }
          }
        }

        .desc {
          width: 100%;
          text-align: center;
          position: absolute;
          top: 66%;
          left: 50%;
          transform: translateX(-50%);

          span {
            color: gray;
            font-size: 13px;
          }

          .num {
            color: $textColor;
            margin-right: 2px;
          }
        }
      }
    }
  }

  .echarts {
    .el-card {
      margin-top: 30px;

      .echarts-title {
        color: $textColor;
        margin-bottom: 20px;
      }
    }
  }
}
</style>