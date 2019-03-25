import React, {Component} from 'react'
import {Radio} from 'antd'
import {createInput} from './context'
import {dataFormat, get} from '../../utils'
import PropTypes from 'prop-types'

@createInput
export class CRadio extends Component {

  /**
   * 类型验证
   * @type {{itemProps: string, show: *, name: *, label: *, fieldDecoratorOptions: string, single: *, initialValue: *}}
   */
  static propTypes = {
    // 是否使用 Form.Item
    single: PropTypes.bool,

    // 显示和隐藏处理函数
    show: PropTypes.func,

    // label
    label: PropTypes.string,

    // 表单 name
    name: PropTypes.string.isRequired,

    // 传递给 Form.Item 的参数信息
    itemProps: PropTypes.object,

    // 传递给 form.getFieldDecorator 第二个参数信息
    fieldDecoratorOptions: PropTypes.object,

    // 初始化值
    initialValue: PropTypes.any,

    // 数据显示 label 的字段信息
    labelKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

    // 数据显示 value 的字段信息
    valueKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

    // 数据信息
    data: PropTypes.array,

    // 是否使用button
    button: PropTypes.bool,
  }

  /**
   * 默认值
   * @type {{data: Array, labelKey: string, valueKey: string}}
   */
  static defaultProps = {
    labelKey: 'label',
    valueKey: 'value',
    data: [],
    button: false,
  }

  render() {
    const {data, labelKey, valueKey, button, ...otherProps} = this.props
    const dataSource = dataFormat(data, labelKey, valueKey)
    if (button) {
      return (<Radio.Group buttonStyle="solid">
        {dataSource.map((v, k) => (<Radio.Button value={get(v, 'value')} key={k}>{get(v, 'label')}</Radio.Button>))}
      </Radio.Group>)
    }

    return <Radio.Group options={dataSource} {...otherProps}/>
  }
}
