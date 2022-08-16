//首页home模块echart图表数据部分
import { ref, reactive, computed } from 'vue'
import { store } from '@/store/index.js';
export default function useHomeEchart() {
    //本年度每月对应文章数量（柱状图数据）
    let MonthArticleNum = computed(() => {
        return store.getters['articles/getMonthArticle']
    })
    //不同分类对应文章（环图数据）
    let categoryArticle = computed(() => {
        let list = []
        let categoryNumSort = store.getters['categories/categoryArticleSort']
        //数量排序前9
        for (let i = 0; i < 9; i++) {
            if (categoryNumSort[i]) {
                list.push({
                    value: categoryNumSort[i].num,
                    name: categoryNumSort[i].name
                })
            }
        }
        return list
    })
    //不同标签对应文章（饼图数据）
    let tagArticle = computed(() => {
        let list = []
        let tagNumSort = store.getters['tags/tagArticleSort']
        //数量排序前9
        for (let i = 0; i < 9; i++) {
            if (tagNumSort[i]) {
                list.push({
                    value: tagNumSort[i].num,
                    name: tagNumSort[i].name
                })
            }
        }
        return list
    })

    //定义echarts的高度
    const heights = ref('280px')
    //柱状图
    let option1 = reactive({
        title: {
            subtext: '本年度每月新增文章数量',
            left: 'center'
        },
        xAxis: {
            type: 'category',
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: MonthArticleNum,
                type: 'bar'
            }
        ]
    });
    //环图
    let option2 = reactive({
        title: {
            subtext: '分类分布前9',
            left: 'center',
            bottom: 10
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: '分类文章数量',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '40',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: categoryArticle
            }
        ]
    });
    //饼图
    let option3 = reactive({
        title: {
            subtext: '标签分布前9',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: '标签文章数量',
                type: 'pie',
                radius: '50%',
                data: tagArticle,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    });

    return {
        heights,
        option1,
        option2,
        option3
    }
}