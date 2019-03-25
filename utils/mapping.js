import lodash from 'lodash'
import {isFunction} from './function'

/**
 * 函数处理数组信息
 * @param array
 * @param fn
 * @returns {Array}
 */
export const mapArray = (array, fn) => {
  const items = []
  array.forEach(value => items.push(fn(value)))
  return items
}

/**
 * 将字符串转为函数
 * @param {string|function} strKey
 * @returns {*}
 */
export const strToFunc = (strKey) => {
  // 是函数，直接返回
  if (isFunction(strKey)) {
    return strKey
  }

  // 存在字符串
  if (typeof strKey === 'string') {
    return (item => get(item, strKey))
  }

  return item => item
}

/**
 * 将数组转为对象
 * @param {array} array 数据
 * @param {string|function} keyName 对象的key 名称
 * @param {string|function} valueName 对象的valueName 名称
 * arrayMap([{username: 1, age: 25}, {username: 2, age: 26}], 'username', 'aget')
 * return {1: 25, 2: 26}
 */
export const arrayMap = (array, keyName = null, valueName = null) => {
  let maps = {}
  const keyFunc = strToFunc(keyName)
  const valueFunc = strToFunc(valueName)
  array.forEach(item => maps[keyFunc(item)] = valueFunc(item))
  return maps
}

/**
 * 获取对象属性
 * @param array
 * @param key
 * @param defaultValue
 * @returns {*}
 */
export const get = (array, key, defaultValue) => {
  return lodash.get(array, key, defaultValue)
}

/**
 * 设置对象属性
 * @param array
 * @param key
 * @param value
 * @returns {*}
 */
export const set = (array, key, value) => {
  return lodash.set(array, key, value)
}

/**
 * 生成随机密码
 * @param {number} len
 * @returns {string}
 */
export const password = len => {
  len = len || 32
  let pwd = '',
    chars = 'ABDEFGHNPQRTYabdefhnprty2345678',
    maxPos = chars.length
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  }

  return pwd
}

/**
 * 将 map 对象转为数组
 * @param {object} item 需要转为数组的对象信息，例如：{1: '测试', 2: '开发'}
 * @param {string} labelName 数组对象 labelName 字段名称
 * @param {string} valueName 数组对象 valueName 字段名称
 * @returns {Array} [{title: '测试', value: 1}, {title: '开发', value: 2}]
 */
export const mapToArray = (item, labelName = 'label', valueName = 'value') => {
  let array = []
  for (const i in item) {
    array.push({
      [labelName]: item[i],
      [valueName]: i,
    })
  }

  return array
}

/**
 * 查找子类信息
 * @param {Array} item
 * @param {string} key
 * @param {object} handleKey
 * @returns {Array}
 */
export const findChildrenObject = (item, key, handleKey = {key1: 'cate_1', key2: 'cate_2', key3: 'cate_3'}) => {
  const o = {}
  const {key1, key2, key3} = handleKey
  item.forEach(item => {
    if (!(item[key1] in o)) {
      o[item[key1]] = {
        label: item[key1],
        value: item[key1],
        children: {},
      }
    }

    if (!(item[key2] in o[item[key1]]['children'])) {
      o[item[key1]]['children'][item[key2]] = {
        label: item[key2],
        value: item[key2],
        children: [],
      }
    }

    o[item[key1]]['children'][item[key2]]['children'].push({
      label: item[key3],
      value: item[key],
    })
  })

  return findChildrenArray(o)
}

/**
 * 查找子类数据信息
 * @param {object} itemObject
 * @returns {Array}
 */
export const findChildrenArray = itemObject => {
  const array = []
  for (const i in itemObject) {
    if (('children' in itemObject[i]) && !Array.isArray(itemObject[i]['children'])) {
      itemObject[i]['children'] = findChildrenArray(itemObject[i]['children'])
    }

    array.push({
      label: i,
      value: i,
      children: itemObject[i]['children'],
    })
  }

  return array
}

/**
 * 查询子类地址信息
 * @param items
 * @param filter
 * @param handleKey
 * @returns {Array}
 */
export const findSubArea = (items, filter, handleKey = {labelKey: 'region_name', valueKey: 'region_id'}) => {
  const data = []
  const {labelKey, valueKey} = handleKey
  items.forEach(v => {
    if (filter(v)) {
      data.push({
        value: get(v, valueKey),
        label: get(v, labelKey),
      })
    }
  })

  return data
}


