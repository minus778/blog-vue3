//创建一个axios实例
import request from "./request"
const http = new request({
    baseURL: 'http://localhost:4000/api',
    timeout: 10000
})
export default http;