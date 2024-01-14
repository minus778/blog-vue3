//创建一个axios实例
import request from "./request"
const http = new request({
    //baseURL: 'https://node.haixtx.club/api',
    baseURL: 'http://localhost:4000/api',
    timeout: 20000
})
export default http;