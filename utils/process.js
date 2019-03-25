import co from 'co'
import {errHandle} from './err'
import {message} from 'antd'

/**
 * 处理函数
 * @param {function} fn 处理函数
 * @param {boolean}  loading 是否需要 loading 加载
 * @param {function} errorHandle 错误处理
 */

let isLoading = false

export const Process = (fn, loading = true, errorHandle = errHandle) => {
  // 处理加载 loading
  let closeLoading = () => {
    isLoading = false
  }
  if (loading && !isLoading) {
    isLoading = true
    closeLoading = message.loading('加载中...', 0)
  }

  // 异步执行
  co(function* () {
    yield fn()
    loading && closeLoading()
  }).catch(e => {
    loading && closeLoading()
    co(function* () {
      if (errorHandle) {
        yield errorHandle(e)
      }
    })
  })
}
