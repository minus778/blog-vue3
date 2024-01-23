//创建一个axios实例
import request from "./request"
const http = new request({
  baseURL: 'http://114.55.75.3:3000/api',
  // baseURL: 'http://localhost:4000/api',
  timeout: 200000
})
export default http;