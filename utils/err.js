import {error} from './notice'
import {get} from './mapping'

export class Err {
  info

  static instance(e) {
    if (e instanceof Err) {
      return e
    }
    return new Err(e)
  }

  constructor(info) {
    this.info = info
  }

  /**
   * 是否不提示错误信息
   * @returns {string[]}
   */
  isIgnore() {
    return get(this.info, 'ignore')
  }

  getMsg() {
    return get(this.info, 'msg') || JSON.stringify(this.info)
  }
}

export const errHandle = function* (e) {
  console.info('error handle:', e)
  e = Err.instance(e)
  if (!e.isIgnore()) {
    error(e.getMsg())
  }
}
