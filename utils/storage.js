import {get} from './mapping'

export default class storage {
  
  /**
   * 初始化处理
   * @param prefix
   */
  constructor(prefix = 'storage') {
    this.prefix = prefix
  }

  /**
   * 前缀
   * @type {string}
   */
  prefix = ''

  /**
   * 用户信息的Key
   *
   * @type {string}
   */
  static userKey = 'user-info'

  /**
   * 获取名称
   * @returns {string}
   */
  getItemName = (name) => {
    return this.prefix + name
  }

  /**
   * 获取用户信息
   * @param {string} key 是否需要获取某个字段信息
   * @returns {{}}
   */
  getUser(key = '') {
    return get(this.get(storage.userKey), key, null)
  }

  /**
   * 设置用户信息
   *
   * @param data
   */
  setUser(data) {
    return this.set(storage.userKey, data)
  }

  /**
   * 删除本地存储的用户数据信息
   *
   * @returns {*}
   */
  deleteUser() {
    return this.delete(storage.userKey)
  }

  /**
   * 设置本地数据
   * @param {string} key 本地存储的key
   * @param {object} value 设置的数据
   */
  set(key, value) {
    return localStorage.setItem(this.getItemName(key), JSON.stringify(value))
  }

  /**
   * 获取本地存储的数据
   * @param key
   * @returns {{}}
   */
  get(key) {
    const value = localStorage.getItem(this.getItemName(key))
    return value ? JSON.parse(value) : {}
  }

  /**
   * 删除本地数
   * @param key
   */
  delete(key) {
    return localStorage.removeItem(this.getItemName(key))
  }
}
