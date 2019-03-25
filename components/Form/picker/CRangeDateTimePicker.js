import React from 'react'
import {createInput} from '../context'
import {ViewRangePicker} from './ViewRangePicker'
import {localeMoment} from '../../../utils'
import PropTypes from 'prop-types'

@createInput
export class CRangeDateTimePicker extends ViewRangePicker {

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

    // 时间格式化
    format: PropTypes.string,
  }

  handleChange = (value) => {
    if (value.length > 0) {
      this.props.onChange([
        localeMoment(value[0]).format('YYYY-MM-DD 00:00:00'),
        localeMoment(value[1]).format('YYYY-MM-DD 23:59:59'),
      ])
    } else {
      this.props.onChange([])
      this.setState({value: null})
    }
  }
}
