//创建一个axios实例
import request from "./request"
const http = new request({
  baseURL: '/api',
  // baseURL: 'http://localhost:4000/api',
  timeout: 200000
})
export default http;