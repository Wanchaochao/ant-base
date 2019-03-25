import React, {Component} from 'react'
import {Checkbox} from 'antd'
import {createInput} from './context'
import PropTypes from 'prop-types'
import {dataFormat} from '../../utils'

@createInput
export class CCheckBox extends Component {

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
  }

  /**
   * 传递的默认值
   * @type {{labelKey: string, valueKey: string}}
   */
  static defaultProps = {
    labelKey: 'label',
    valueKey: 'value',
    data: [],
  }

  render() {
    const {data, labelKey, valueKey, ...otherProps} = this.props
    const options = dataFormat(data, labelKey, valueKey)
    return <Checkbox.Group options={options} {...otherProps}/>
  }
}
