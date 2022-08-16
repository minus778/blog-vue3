//按需引入echarts用到的图表及对应组件
import * as echarts from 'echarts/core';
//引入图表
import {
    //柱状图
    BarChart,
    BarSeriesOption,
    //饼图，环图
    PieChart,
    PieSeriesOption,
} from 'echarts/charts';
//引入组件
import {
    GridComponent,
    GridComponentOption,
    TitleComponent,
    // 组件类型的定义后缀都为 ComponentOption
    TitleComponentOption,
    TooltipComponent,
    TooltipComponentOption,
    LegendComponent,
    LegendComponentOption,
} from 'echarts/components';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type ECOption = echarts.ComposeOption<
    | BarSeriesOption
    | PieSeriesOption
    | LegendComponentOption
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
>;

// 注册必须的组件
echarts.use([
    GridComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    BarChart,
    PieChart,
    LabelLayout,
    CanvasRenderer
]);
export default function useEcharts(el: HTMLElement) {
    //初始化echarts
    const echartsInstance = echarts.init(el);

    //设置options
    const setOptions = (options: ECOption) => {
        echartsInstance.setOption(options)
    }

    //自适应监听
    const resize = () => {
        echartsInstance.resize()
    }

    return {
        setOptions,
        resize,
    }
}