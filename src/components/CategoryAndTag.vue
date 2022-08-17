<template>
    <div class="category container">
        <div class="top">
            <el-button type="primary" :icon="Plus" size="small" @click="addCategory">新增</el-button>
        </div>
        <div class="table">
            <!-- 表格 -->
            <el-table :data="tableData" border style="width: 100%" :height="tableHeigth" @sort-change="tableSort">
                <el-table-column prop="id" label="id" width="90" sortable="custom" align="center" />
                <el-table-column prop="name" label="名称" width="280" align="center">
                    <template #default="scope">
                        <el-tag class="ml-2"
                            :style="{ color: scope.row.color, backgroundColor: colorRgb(scope.row.color, 0.1), border: `1px solid ${colorRgb(scope.row.color, 0.2)}`, whiteSpace: 'wrap' }">
                            {{
                                    scope.row.name
                            }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="date" label="日期" sortable="custom" width="190" align="center" />
                <el-table-column prop="num" label="文章数量" width="150" align="center" sortable="custom" />
                <el-table-column prop="action" label="操作" align="center" min-width="175">
                    <template #default="scope">
                        <el-button size="small" type="primary" :icon="Edit" @click="editCategory(scope.row)">编辑
                        </el-button>
                        <el-button size="small" type="danger" :icon="Delete" @click="deleteCategory(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="dialog">
            <el-dialog v-model="isShowDialog" :title="isAdd ? '新增' : '编辑'">
                <el-input v-model="name" :placeholder="`输入${props.CTname}名称`" :prefix-icon="Notebook" class="input" />
                <div class="demo-color-block">
                    <span class="demonstration">选择背景颜色：</span>
                    <el-color-picker v-model="color" />
                </div>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="isShowDialog = false">取消</el-button>
                        <el-button type="primary" @click="confirm">确定</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { Edit, Delete, Plus, Notebook } from '@element-plus/icons-vue';
import { ref, onMounted, nextTick } from 'vue'
import { useStore } from '@/store'
import useDate from '@/hooks/useDate'
import useColor from '@/hooks/useColor'

//声明props(只能在setup中使用)
const props = withDefaults(defineProps<{
    CTname: string,
    CTlist: Object[],
    CTdelete: string,
    CTadd: string,
    CTedit: string
}>(), {
    CTname: '',
    CTlist: () => [],
    CTdelete: '',
    CTadd: '',
    CTedit: ''
})
//声明emit触发事件
// const emit = defineEmits<{
//     (e: 'onDelete', id: number): void
//     (e: 'onAdd', data: Object): void
//     (e: 'onEdit', data: Object): void
// }>()

const store = useStore()
const { typeTime, timeSort } = useDate()
const { colorRgb } = useColor()
//表格的高度
let tableHeigth = ref(0);
//表格展示的数据
let tableData = ref([])
//是否显示弹框
let isShowDialog = ref(false)
//新增/编辑
let isAdd = ref(true)
//名称
let name = ref('')
//背景颜色
let color = ref('#a862ea')
//编辑文章id
let editId = ref(-1)

//首次加载
onMounted(() => {
    //获取表格高度
    nextTick(() => {
        tableHeigth.value = window.innerHeight - 180
    })
    showTableForm(JSON.parse(JSON.stringify(props.CTlist)))
})

//处理展示的表格数据
const showTableForm = (list?: any) => {
    if (list) {
        tableData.value = list
    }
    //处理时间
    tableData.value.forEach((item: any) => {
        item.date = typeTime(item.date)
    })
}

//表格排序
const tableSort = (temp: any) => {
    let list = JSON.parse(JSON.stringify(props.CTlist))
    const { prop, order } = temp
    //prop为当前排序的属性，order为排序条件（ascending为升序，descending 为降序，null为原始顺序）
    if (prop && order) {
        let sort = order === 'ascending' ? 'small' : 'big'
        tableData.value = timeSort(list, prop, sort)
    } else {
        tableData.value = list
    }
    showTableForm()
}

//新增
const addCategory = () => {
    isShowDialog.value = true
    isAdd.value = true
    color.value = '#a862ea'
    name.value = ''
}

//编辑
const editCategory = (item: any) => {
    isShowDialog.value = true
    isAdd.value = false
    name.value = item.name
    color.value = item.color
    editId.value = item.id
}

//删除
const deleteCategory = (item: any) => {
    if (item.num != 0) {
        ElMessage({
            message: `该${props.CTname}下还有${item.num}篇文章，请先转移文章后再删除！`,
            type: 'warning'
        })
    } else {
        //确认弹框
        ElMessageBox.confirm(
            `真的要把${props.CTname}(${item.name})删掉了吗？要不要再考虑下？`,
            '提示',
            {
                confirmButtonText: '删了吧！',
                cancelButtonText: '我再考虑下',
                type: 'warning',
            }
        )
            .then(() => {
                store.dispatch(`${props.CTdelete}` as any, item.id).then((res: any) => {
                    if (res.code === 200) {
                        ElMessage({
                            message: res.msg,
                            type: 'success'
                        })
                        showTableForm(JSON.parse(JSON.stringify(props.CTlist)))
                    }
                }).catch((err: any) => {
                    console.log(err)
                    ElMessage.error('请求出错')
                })
            })
    }

}

//确认
const confirm = () => {
    //输入不能为空
    if (name.value === '') {
        ElMessage({
            message: `${props.CTname}名称不能为空`,
            type: 'warning'
        })
    } else {
        isShowDialog.value = false
        if (isAdd.value) {
            //添加
            let data = {
                name: name.value,
                color: color.value,
                date: +new Date()
            }
            store.dispatch(`${props.CTadd}` as any, data).then((res: any) => {
                if (res.code === 200) {
                    ElMessage({
                        message: res.msg,
                        type: 'success'
                    })
                    showTableForm(JSON.parse(JSON.stringify(props.CTlist)))
                }
            }).catch((err: any) => {
                console.log(err)
                ElMessage.error('请求出错')
            })
        } else {
            //编辑
            let data = {
                id: editId.value,
                name: name.value,
                color: color.value,
                date: +new Date()
            }
            store.dispatch(`${props.CTedit}` as any, data).then((res: any) => {
                if (res.code === 200) {
                    ElMessage({
                        message: res.msg,
                        type: 'success'
                    })
                    showTableForm(JSON.parse(JSON.stringify(props.CTlist)))
                }
            }).catch((err: any) => {
                console.log(err)
                ElMessage.error('请求出错')
            })
        }
    }
}

</script>

<style scoped lang='scss'>
:deep(.el-dialog) {
    width: 400px;
}

:deep(.el-tag) {
    white-space: normal;
    max-width: 250px;
    height: auto;
    padding: 5px;
}

:deep(.el-table .cell) {
    padding: 0 8px;
}

.category {
    .top {
        margin-bottom: 20px;
    }

    .dialog {
        .input {
            margin-bottom: 20px;
        }
    }
}
</style>