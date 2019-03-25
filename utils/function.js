import numeral from 'numeral'
import {get} from './mapping'
import moment from 'moment'

/**
 * 验证是否为函数
 *
 * @param functionToCheck
 * @returns {*|boolean}
 */
export const isFunction = (functionToCheck) => functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'

/**
 * 验证值是否在其中
 * @param path
 * @param value
 * @returns {function(*=): boolean}
 */
export const isRowValue = (path, value) => param => get(param, path) == value

/**
 * 字符串首字母小写
 * @param {string} s 处理字符串
 */
export const firstToLowerCase = s => s.substr(0, 1).toLocaleLowerCase() + s.substr(1)

/**
 * 格式化数据
 * @param {number} value 需要格式化的数据
 * @param {string} format 格式
 * @returns {*}
 */
export const numberFormat = (value, format = '0,0.00') => numeral(value).format(format)

/**
 * 将分转为元的显示
 * @param val
 * @returns {string}
 */
export const renminbi = val => `¥ ${numberFormat(priceConvertUnit(val))} 元`

/**
 * 分转元的格式化金额
 * @param val
 * @type {*}
 */
export const priceFormat = val => numberFormat(priceConvertUnit(val))

/**
 * 分转元不格式化
 * @param val
 * @type {*}
 */
export const priceConvertUnit = val => val / 100

/**
 * 格式化输出JSON
 * @param val
 * @returns {string}
 */
export const jsonFormat = val => {
  if (val) {

    if (typeof val !== 'object') {
      if (val.substr(0, 1) !== '{') {
        return val
      }
      val = JSON.parse(val)
    }

    return JSON.stringify(val, null, 2)
  }
  return val
}

/**
 * 数据格式化
 * @param data
 * @param labelKey
 * @param valueKey
 * @returns {*|Uint8Array|BigInt64Array|{label: *, value: *}[]|Float64Array|Int8Array|Float32Array|Int32Array|Uint32Array|Uint8ClampedArray|BigUint64Array|Int16Array|Uint16Array}
 */
export const dataFormat = (data, labelKey = 'label', valueKey = 'value') => {
  if (labelKey === 'label' && valueKey === 'value') {
    return data
  }

  return data.map(item => {
    const label = isFunction(labelKey) ? labelKey(item) : get(item, labelKey)
    const value = isFunction(valueKey) ? valueKey(item) : get(item, valueKey)
    return {...item, label, value}
  })
}


/**
 *
 * @param args
 * @returns {moment.Moment}
 */
export const localeMoment = (...args) => moment(...args).locale('zh-cn')
