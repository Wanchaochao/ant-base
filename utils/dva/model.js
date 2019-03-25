import {firstToLowerCase} from '../function'
import {args2RedusAction, dispatch} from './connect'

/**
 * 处理 dva model
 * 1. effects 的异步函数，执行的时候，里面 put({type: type, payload: data}) 可以简写put(type, data) 并且兼容 put({type: type, payload: data})
 * 2. effects 的异步函数，如果函数名称为 XXXOneAction 那么只需要加载一次( get 开头 & OneAction 结尾的函数)
 * 3. 只加载一次、需要数据命名 这里以 regions 省份信息、 那么 effects 的函数名称为 getRegionsOneAction, reducers 中的函数名称为 setRegions
 * @param item
 * @returns {*}
 */


function str2Classname(s) {
  let rs = ''
  let needUpper = true
  for (let i = 0; i < s.length; i++) {
    let c = s[i]
    if (c === '_') {
      needUpper = true
      continue
    }

    if (needUpper) {
      c = c.toUpperCase()
    }
    rs += c
    needUpper = false
  }
  return rs
}


export const model = item => {

  // 自动添加所有state 的默认 reducers
  if (item.state) {
    const defaultReducer = {}
    Object.keys(item.state).forEach(v => {
      const methodName = str2Classname(v)
      // 添加保存
      const field = `save${methodName}`
      defaultReducer[field] = (state, {payload}) => {
        return {
          ...state,
          [v]: payload,
        }
      }

      // 添加合并方法
      const merge = `merge${methodName}`
      defaultReducer[merge] = (state, {payload}) => {
        return {
          ...state,
          [v]: {
            ...state[v],
            ...payload,
          },
        }
      }
    })

    // 没有定义 reducers
    if (!item.reducers) {
      item.reducers = {}
    }

    // 合并
    item.reducers = {...defaultReducer, ...item.reducers}
  }


  // 处理异步
  if (item.effects) {
    for (const action in item.effects) {
      const actionFunc = item.effects[action]
      item.effects[action] = function* (data, callParams) {
        // 处理方法调用简写
        const putHandle = callParams.put
        callParams.put = (...args) => putHandle(args2RedusAction(...args))

        // 注入 dispatch 函数
        callParams.dispatch = (...args) => {
          const dispatchAction = args2RedusAction(...args)
          if (dispatchAction.type.indexOf('/') === -1) {
            dispatchAction.type = `${item.namespace}/${dispatchAction.type}`
          }

          return dispatch(dispatchAction)
        }

        // 如果函数以 get 开头 && 以 OneAction 结尾的函数，只需要执行一次
        if (action.startsWith('get') && action.endsWith('OneAction')) {
          const actionName = action.slice(3, -9)
          const name = firstToLowerCase(actionName)
          const stateName = yield callParams.select(state => state[item.namespace][name])
          if (stateName && stateName.load) {
            return
          }

          yield callParams.put(`merge${actionName}`, {load: true})
        }

        return yield actionFunc(data, callParams)
      }
    }
  }
  return item
}
