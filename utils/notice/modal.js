import {Modal, notification} from 'antd'
import {dispatch} from '../dva'

/**
 * 异步确认操作
 * @param {object|string} options modal.confirm 的配置信息
 * @returns {Promise<any>}
 */
export const confirm = (options) => {
  // 字符串类型转换为对象
  if (typeof options === 'string') {
    options = {content: options}
  }

  return new Promise((resolve) => {
    Modal.confirm({
      title: '提示',
      cancelText: '取消',
      okText: '确认',
      maskClosable: true,
      ...options,
      onOk: () => resolve(1),
      onCancel: () => resolve(0),
    })
  })
}

/**
 * 系统错误提示
 * @param {string} content 提示内容
 * @param {object} options notification 其他配置信息
 */
export const error = (content, options = {}) => {
  notification.error({
    message: '系统提示',
    description: content || '服务器繁忙,请稍后再试...',
    ...options,
  })
}

/**
 * 系统成功处理提示
 * @param {string} content 提示内容
 * @param {object} options notification 其他配置信息
 */
export const success = (content, options = {}) => {
  notification.success({
    message: '系统提示',
    description: content || '处理成功',
    ...options,
  })
}

export const dialog = (title, content, options = {}) => {
  dispatch('global/saveModal', {
    visible: true,
    title,
    children: content,
    ...options,
  })
}

export const closeDialog = () => {
  dispatch('global/saveModal', {
    visible: false,
  })
}
