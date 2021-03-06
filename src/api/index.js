import axios from 'axios'
import { getStorage, setStorage, removeStorage } from 'common/js/localstorage'

const request = axios.create({
  // baseURL,
  headers: {
    "Content-Type": "application/json;charset=UTF-8"
  }
})

request.interceptors.request.use(
  config => {
    config.baseURL = process.env.NODE_ENV === 'production' ? window.baseUrl : 'http://localhost:2333'
    config.headers.common['Authorization'] = 'Bearer ' + getStorage('user').token
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    if (response.headers.new_token) {
      //判断返回头是否有new_token字段
      let storage = getStorage('user')
      //更新token
      storage.token = response.headers.new_token
      setStorage('user', storage)
    }
    if (response.data.status === 401) {
      //清除storage
      removeStorage('user')
      
      window.location.href = '#/login'

      return response

    } else {
      return response
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default request