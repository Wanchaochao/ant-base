import {Divider, Menu, Dropdown, Icon, Badge} from 'antd'
import React, {Fragment} from 'react'
import router from 'umi/router'

/**
 * 渲染按钮信息
 * @param {function} handle 处理方法
 * @param {array} buttons 按钮信息
 *
 * @returns {Function}
 */
export const renderButtons = (handle, buttons) => (value, params) => {
  let array_buttons = []
  buttons.forEach((item, index) => {
    const length = array_buttons.length
    // 数组
    if (Array.isArray(item)) {
      let itemArray = []
      item.forEach(itemChildren => {
        if (!itemChildren.show || itemChildren.show(params)) {
          itemArray.push(<Menu.Item key={itemChildren.key}>{itemChildren.title}</Menu.Item>)
        }
      })

      // 存在数据才渲染
      if (itemArray.length > 0) {
        array_buttons.push(
          <Dropdown
            key={index + 'dropdown'}
            overlay={<Menu onClick={(menuKey) => handle(menuKey.key, params)}>{itemArray}</Menu>}>
            <a className="ant-dropdown-link" href="#">
              操作 <Icon type="down"/>
            </a>
          </Dropdown>,
        )
      }
    } else {
      if (!item.show || item.show(params)) {
        // 默认点击事件
        const onClick = () => handle(item.key, params)

        let props = {
          onClick,
        }

        // 处理链接
        if (item.href) {
          props.href = item.href
          if (typeof item.href !== 'string') {
            props.href = item.href(params)
            props.target = item.target || '_blank'
          }
        }

        // 处理路由
        if (item.router) {
          let routerUrl = item.router
          if (typeof item.router !== 'string') {
            routerUrl = item.router(params)
          }

          // 重新处理跳转地址
          props.onClick = () => router.push(routerUrl)
        }

        array_buttons.push(<a key={index} {...props}>{item.title}</a>)
      }
    }

    // 数组添加了元素、那么添加一个分割线
    if (length !== array_buttons.length) {
      array_buttons.push(<Divider key={index + '-divider'} type="vertical"/>)
    }
  })

  array_buttons.pop()

  return (
    <Fragment>{array_buttons}</Fragment>
  )
}

/**
 * 渲染状态信息
 * @param val
 * @returns {Function}
 */
export const statusRender = val => (value) => {
  if (value == val) {
    return <Badge text="启用" status="success"/>
  }

  return <Badge text="停用" status="error"/>
}
