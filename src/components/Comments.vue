<template>
    <div class="commmentList">
        <div class="top">
            <div class="left">
                <!-- 下拉查询 -->
                <el-dropdown>
                    <el-button type="primary" size="small">
                        {{ chooseMethod }}<el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-for="(item, i) in dropList" :key="i" @click="chooseMethod = item">{{
                                    item
                            }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <!-- 搜索栏部分 -->
                <el-input v-model="commentId" placeholder="输入评论id" :prefix-icon="Search" class="input"
                    v-if="chooseMethod === '按评论id查询'" />
                <el-input v-model="commentName" placeholder="输入评论人昵称" :prefix-icon="Search" class="input"
                    v-if="chooseMethod === '按昵称查询'" />
                <div class="datepicker">
                    <el-date-picker v-model="date" type="datetimerange" range-separator="To"
                        start-placeholder="Start date" end-placeholder="End date" v-if="chooseMethod === '按时间查询'" />
                </div>
                <div class="type" v-if="chooseMethod === '按评论类型查询'">
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            <el-tag class="ml-2" v-if="commentType === '一级评论'"
                                :style="{ color: '#F9251A', backgroundColor: 'rgb(249,37,26,0.1)', border: `1px solid rgb(249,37,26,0.2)` }">
                                一级评论
                            </el-tag>
                            <el-tag class="ml-2" v-if="commentType === '二级评论'"
                                :style="{ color: '#4AD16E', backgroundColor: 'rgb(74,209,110,0.1)', border: `1px solid rgb(74,209,110,0.2)` }">
                                二级评论
                            </el-tag>
                            <el-icon class="el-icon--right">
                                <arrow-down />
                            </el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>
                                    <el-tag class="ml-2" @click="commentType = '一级评论'"
                                        :style="{ color: '#F9251A', backgroundColor: 'rgb(249,37,26,0.1)', border: `1px solid rgb(249,37,26,0.2)` }">
                                        一级评论
                                    </el-tag>

                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-tag class="ml-2" @click="commentType = '二级评论'"
                                        :style="{ color: '#4AD16E', backgroundColor: 'rgb(74,209,110,0.1)', border: `1px solid rgb(74,209,110,0.2)` }">
                                        二级评论
                                    </el-tag>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <el-input v-model="articleId" placeholder="输入文章id" :prefix-icon="Search" class="input"
                    v-if="chooseMethod === '按所属文章id查询' && props.commentName === '文章评论'" />

                <!-- 操作按钮 -->
                <el-button type="primary" :icon="Search" size="small" @click="search" class="search">查询</el-button>
                <el-button style="color: #FF7670;" @click="resetBtn" :icon="Close" size="small">重置</el-button>
            </div>
            <div class="right" @click="allRead(props.commentName === '文章评论' ? 'article' : 'message')">
                <el-icon>
                    <Refresh />
                </el-icon>
                <span>一键已读</span>
            </div>
        </div>
        <div class="table">
            <!-- 表格 -->
            <el-table :data="tableData" border style="width: 100%" :height="tableHeigth" @sort-change="tableSort">
                <el-table-column prop="id" label="id" width="65" sortable="custom" align="center">
                    <template #default="scope">
                        <div class="fir">
                            <span class="newMes" v-if="!scope.row.read">1</span>
                            <span>{{ scope.row.id }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="froms" label="昵称" width="85" align="center" />
                <el-table-column prop="tos" label="回复对象" width="90" align="center">
                    <template #default="scope">
                        <el-tag class="ml-2" v-if="scope.row.tos"
                            :style="{ color: '#a862ea', backgroundColor: 'rgb(168,98,234,0.1)', border: `1px solid rgb(168,98,234,0.2)`, whiteSpace: 'wrap' }">
                            @{{
                                    scope.row.tos
                            }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="评论内容" width="130">
                    <template #default="scope">
                        <div :style="{ display: 'flex', alignItems: 'center' }">
                            <el-icon color="red" v-if="scope.row.isdelArticle">
                                <CircleClose />
                            </el-icon>
                            <el-icon color="#e6a23c" v-if="scope.row.parentDelete">
                                <Warning />
                            </el-icon>
                            <span>{{ scope.row.content }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱" min-width="106" align="center" />
                <el-table-column prop="date" label="日期" sortable="custom" width="100" align="center" />
                <el-table-column prop="articleId" label="所属文章id" width="87" align="center"
                    v-if="props.commentName === '文章评论'" />
                <el-table-column prop="types" label="类型" width="92" align="center">
                    <template #default="scope">
                        <el-tag class="ml-2" v-if="!scope.row.tos"
                            :style="{ color: '#F9251A', backgroundColor: 'rgb(249,37,26,0.1)', border: `1px solid rgb(249,37,26,0.2)`, whiteSpace: 'wrap' }">
                            一级评论
                        </el-tag>
                        <el-tag class="ml-2" v-else
                            :style="{ color: '#4AD16E', backgroundColor: 'rgb(74,209,110,0.1)', border: `1px solid rgb(74,209,110,0.2)`, whiteSpace: 'wrap' }">
                            二级评论
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="action" label="操作" align="center" min-width="192">
                    <template #default="scope">
                        <el-button size="small" type="warning" :icon="View" class="table-btn" v-if="!scope.row.read"
                            @click="readnow(scope.row.id, props.commentName === '文章评论' ? 'article' : 'message')">
                            已读</el-button>
                        <el-button size="small" type="primary" :icon="Edit" class="table-btn"
                            @click="changeArticles(scope.row)">回复</el-button>
                        <el-button size="small" type="danger" :icon="Delete" class="table-btn"
                            @click="deleteArticles(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="tip">
            <el-tag class="ml-2" type="success">小贴士</el-tag>：
            <div class="tip-item">
                <div class="item">
                    <el-icon color="#e6a23c">
                        <Warning />
                    </el-icon>
                    <span>代表该评论(二级评论)对应的楼主(一级评论)被删除了</span>
                </div>
                <div class="item" v-if="props.commentName === '文章评论'">
                    <el-icon color="red">
                        <CircleClose />
                    </el-icon>
                    <span>代表该评论对应的文章已被删除</span>
                </div>
            </div>
        </div>
        <div class="footer">
            <!-- 分页 -->
            <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize"
                :page-sizes="[10, 15, 20, 25, 30]" :background="true" layout="total, sizes, prev, pager, next, jumper"
                :total="commentSortList.length" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
        <!-- 回复框 -->
        <div class="dialog">
            <el-dialog v-model="dialogFormVisible" title="Shipping address" :show-close="false" width="450px">
                <template #header>
                    <div class="dialog-header">
                        <div class="userimg">
                            <div class="userimg-item">
                                <img :src="`${avatar}`" />
                            </div>
                        </div>
                        <div class="header-content">
                            <div class="reply">
                                <span>回复：</span>
                                <span>{{ replyMes.froms }}</span>
                            </div>
                            <el-icon class="del-icon" @click="dialogFormVisible = false">
                                <CircleClose />
                            </el-icon>
                        </div>
                    </div>
                </template>
                <div class="dialog-content">
                    <el-input v-model="replayContent" maxlength="200" placeholder="说些什么呢..." show-word-limit
                        type="textarea" resize="none" />
                </div>
                <template #footer>
                    <div class="dialog-footer">
                        <div class="text">
                            <el-icon>
                                <Edit />
                            </el-icon>
                            <span>善言结善缘，恶语伤人心</span>
                        </div>
                        <el-button type="primary" :style="{ borderRadius: '20px' }" @click="submitComment">提交评论
                        </el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ArrowDown, Search, Edit, Close, Delete, View, Refresh, Warning, CircleClose } from '@element-plus/icons-vue'
import useComment from '@/composables/comment/useComment'
import useCommentSearch from '@/composables/comment/useCommentSearch'
import useCommentTable from '@/composables/comment/useCommentTable'

//声明props(只能在script标签setup语法糖中声明，不能在hooks中去声明)
const props = withDefaults(defineProps<{
    commentName: string,
    commentList: Object[]
}>(), {
    commentName: '',
    commentList: () => []
})

//基础共用数据及逻辑
const { tableData, tableHeigth, currentPage, pageSize, commentSortList, serachCommentList, baseUrl, avatar, handleSizeChange, handleCurrentChange, showTableForm, allRead } = useComment(props)
//表格部分
const { dialogFormVisible, replyMes, replayContent, tableSort, changeArticles, deleteArticles, readnow, submitComment } = useCommentTable(props, commentSortList, serachCommentList, showTableForm)
//头部查询部分
const { chooseMethod, dropList, commentId, commentName, date, commentType, articleId, search, resetBtn } = useCommentSearch(serachCommentList, props, currentPage, showTableForm)

</script>

<style scoped lang='scss'>
@import '@/assets/css/controller.scss';

:deep(.el-tag) {
    white-space: normal;
    max-width: 70px;
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

:deep(.el-dialog) {
    border-radius: 20px;
}

:deep(.el-dialog__header) {
    margin: 0;
}

:deep(.el-dialog__body) {
    padding: 10px 20px;
}

:deep(.el-textarea__inner) {
    width: 100%;
    height: 160px;
    background-color: #f1f1f1;
    border-radius: 20px;
    padding: 10px;
}

:deep(.el-input__count) {
    background-color: #f1f1f1;
}

.commmentList {
    padding: 13px 20px 0 20px;

    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left {
            display: flex;
            align-items: center;

            .input {
                margin-left: 10px;
                width: 200px;
                height: 25px;
                font-size: 13px;
            }

            .search {
                margin-left: 10px;
            }

            .type {
                .el-dropdown-link {
                    display: flex;
                    align-items: center;
                    box-shadow: 1px 1px 10px #e4e7ed;
                    margin-left: 10px;
                    border-radius: 4px;
                    padding-right: 5px;
                }
            }
        }

        .right {
            display: flex;
            margin-right: 20px;
            align-items: center;
            color: red;
            font-size: 14px;
            cursor: pointer;
        }
    }

    .table {
        margin-top: 20px;

        .fir {
            display: flex;
            justify-content: space-around;
            align-items: center;

            .newMes {
                display: inline-block;
                width: 14px;
                height: 14px;
                line-height: 14px;
                border-radius: 50%;
                background-color: red;
                color: white;
                font-size: 12px;
                text-align: center;
            }
        }

        .table-btn {
            width: 50px;
            font-size: 12px;
        }
    }

    .tip {
        display: flex;
        margin-top: 5px;
        align-items: center;
        font-size: 12px;

        .tip-item {

            .item {
                display: flex;
                align-items: center;
            }
        }
    }

    .footer {
        display: flex;
        justify-content: right;
        align-items: center;

    }

    .dialog {
        .dialog-header {
            position: relative;
            padding-left: 60px;

            .userimg {
                position: absolute;
                top: -40px;
                left: -20px;
                width: 70px;
                height: 70px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                background-color: white;

                .userimg-item {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    overflow: hidden;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }


            }

            .header-content {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .reply {
                    color: $textColor;
                }

                .del-icon {
                    color: gray;
                    cursor: pointer;

                    &:hover {
                        color: $textColor;
                    }
                }
            }
        }

        .dialog-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .text {
                display: flex;
                align-items: center;
                color: $textColor;
                font-size: 15px;

                span {
                    margin-left: 5px;
                }
            }
        }
    }
}
</style>