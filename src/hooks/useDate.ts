//处理时间hook
export default function useDate() {
    //将时间改为‘2分钟前’的格式
    const typeBeforeDate = (time: number) => {
        let str = ''
        //获取当前毫秒数
        let now = +new Date()
        //获取相差分钟
        let dates = Math.floor((now - time) / 1000 / 60)

        if (dates < 1 && dates >= 0) {
            str = '刚刚'
        }
        if (dates >= 1 && dates < 60) {
            str = dates + '分钟前'
        }
        if (dates >= 60 && dates < 1440) {
            str = Math.floor(dates / 60) + '小时前'
        }
        if (dates >= 1440 && dates < 43200) {
            str = Math.floor(dates / 60 / 24) + '天前'
        }
        if (dates >= 43200 && dates < 518400) {
            str = Math.floor(dates / 60 / 24 / 30) + '个月前'
        }
        if (dates >= 518400) {
            str = Math.floor(dates / 60 / 24 / 30 / 12) + '年前'
        }
        return str
    }
    //时间排序(从大到小)
    const timeSort = (list: any, str: string, type: string) => {
        return list.sort(compare(str, type))
    }
    //将数组以数组中的某个元素从大到小排序
    const compare = (property: any, type: string) => {
        return function (a: any, b: any) {
            var value1 = a[property];
            var value2 = b[property];
            //从小到大排序
            if (type === 'small') {
                return value1 - value2
            }
            //从大到小排序
            if (type === 'big') {
                return value2 - value1;
            }
        }
    }
    // 格式化时间：年-月-日-时:分
    const typeTimes = function (time: any) {
        let date = new Date(time)
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '-';
        let H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        let MS = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
        return Y + M + D + H + MS
    }
    //格式化时间：年-月-日
    const typeTime = function (time: any) {
        let date = new Date(time)
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
        return Y + M + D
    }
    return {
        typeBeforeDate,
        timeSort,
        typeTimes,
        typeTime
    }
}