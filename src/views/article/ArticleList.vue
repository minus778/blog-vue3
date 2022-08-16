<template>
    <div class="articleList">
        <div class="top">
            <!-- 下拉查询 -->
            <el-dropdown>
                <el-button type="primary" size="small">
                    {{ chooseMethod }}<el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item v-for="(item, i) in dropList" :key="i" @click="chooseMethod = item">{{ item }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <!-- 搜索栏部分 -->
            <el-input v-model="articleId" placeholder="输入文章id" :prefix-icon="Search" class="input"
                v-if="chooseMethod === '按文章id查询'" />
            <el-input v-model="articleName" placeholder="输入文章名称" :prefix-icon="Search" class="input"
                v-if="chooseMethod === '按文章名查询'" />
            <div class="datepicker">
                <el-date-picker v-model="date" type="datetimerange" range-separator="To" start-placeholder="Start date"
                    end-placeholder="End date" v-if="chooseMethod === '按时间查询'" />
            </div>
            <el-input v-model="categoryName" placeholder="输入分类名称" :prefix-icon="Search" class="input"
                v-if="chooseMethod === '按分类名称查询'" />
            <el-input v-model="tagName" placeholder="输入标签名称" :prefix-icon="Search" class="input"
                v-if="chooseMethod === '按标签名称查询'" />
            <!-- 操作按钮 -->
            <el-button type="primary" :icon="Search" size="small" @click="search">查询</el-button>
            <el-button style="color: #FF7670;" @click="resetBtn" :icon="Close" size="small">重置</el-button>
        </div>
        <div class="table">
            <!-- 表格 -->
            <el-table :data="tableData" border style="width: 100%" :height="tableHeigth" @sort-change="tableSort">
                <el-table-column prop="id" label="id" width="60" sortable="custom" align="center" />
                <el-table-column prop="title" label="标题" width="150" />
                <el-table-column prop="date" label="日期" sortable="custom" width="108" align="center" />
                <el-table-column prop="categoryId" label="分类" width="100" align="center">
                    <template #default="scope">
                        <el-tag class="ml-2"
                            :style="{ color: scope.row.categoryId.color, backgroundColor: colorRgb(scope.row.categoryId.color, 0.1), border: `1px solid ${colorRgb(scope.row.categoryId.color, 0.2)}`, whiteSpace: 'wrap' }">
                            {{
                                    scope.row.categoryId.name
                            }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="tagId" label="标签" width="100" align="center">
                    <template #default="scope">
                        <el-tag class="ml-2" v-for="item in scope.row.tagId"
                            :style="{ color: item.color, backgroundColor: colorRgb(item.color, 0.1), border: `1px solid ${colorRgb(item.color, 0.2)}` }"
                            :key="item.id">{{
                                    item.name
                            }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="readNum" label="浏览量" sortable="custom" width="83" align="center" />
                <el-table-column prop="likes" label="喜欢" width="73" sortable="custom" align="center" />
                <el-table-column prop="comment" label="评论" width="73" sortable="custom" align="center" />
                <el-table-column prop="isshow" label="是否展示" width="73" align="center">
                    <template #default="scope">
                        <el-switch :model-value="scope.row.isshow === 'true'" disabled />
                    </template>
                </el-table-column>
                <el-table-column prop="action" label="操作" align="center" min-width="130">
                    <template #default="scope">
                        <el-button size="small" type="primary" :icon="Edit" class="table-btn"
                            @click="changeArticles(scope.row.id)">编辑</el-button>
                        <el-button size="small" type="danger" :icon="Delete" class="table-btn"
                            @click="deleteArticles(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="footer">
            <!-- 分页 -->
            <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize"
                :page-sizes="[10, 15, 20, 25, 30]" :background="true" layout="total, sizes, prev, pager, next, jumper"
                :total="artileSortList.length" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<!-- 这个组件模块的articleList是仓库获取到的文章列表数据，serachArticleList是通过输入框查询到的文章列表数据，这两个都是中间数据，需要在排序的原始数据用到，不能被修改，在赋值时需要深拷贝避免被同步修改 -->
<!-- artileSortList是该模块用于显示到表格中的数据，在分页和排序时都会改变，在遇到排序原始数据时会从上面的两个中间数据拿值，需要深拷贝拿值 -->
<script setup lang='ts'>
import { ArrowDown, Search, Edit, Close, Delete } from '@element-plus/icons-vue'
import useColor from '@/hooks/useColor'
import useArticle from '@/composables/article/useArticle'
import useArticleSearch from '@/composables/article/useArticleSearch'
import useArticleTable from '@/composables/article/useArticleTable'
const { colorRgb } = useColor()

//基础共用数据及逻辑
const { tableData, tableHeigth, currentPage, pageSize, artileSortList, articleList, serachArticleList, editArticleId, handleSizeChange, handleCurrentChange, showTableForm } = useArticle()
//表格部分
const { tableSort, changeArticles, deleteArticles } = useArticleTable(editArticleId, articleList, artileSortList, serachArticleList, showTableForm)
//头部查询部分
const { chooseMethod, dropList, articleId, articleName, date, categoryName, tagName, search, resetBtn } = useArticleSearch(serachArticleList, articleList, currentPage, showTableForm)


</script>

<style scoped lang='scss'>
:deep(.el-tag) {
    white-space: normal;
    max-width: 90px;
    height: auto;
    padding: 5px;
}

:deep(.el-range-editor.el-input__wrapper) {
    margin: 0 10px;
    width: 380px;
    height: 25px;
    font-size: 13px;
}

:deep(.el-date-editor .el-range-separator) {
    position: relative;
    top: -1px;
}

:deep(.el-table .cell) {
    padding: 0 8px;
}

.articleList {
    padding: 20px 20px 0 20px;

    .top {
        display: flex;
        align-items: center;

        .input {
            margin: 0 10px;
            width: 200px;
            height: 25px;
            font-size: 13px;
        }
    }

    .table {
        margin: 20px 0;

        .table-btn {
            width: 50px;
            font-size: 12px;
        }
    }

    .footer {
        display: flex;
        justify-content: right;
        align-items: center;
    }
}
</style>