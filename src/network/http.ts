//创建一个axios实例
import request from "./request"
const http = new request({
    baseURL: 'https://node.haixtx.club/api',
    timeout: 10000
})
export default http;