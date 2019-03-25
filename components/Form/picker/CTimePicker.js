import React, {Component} from 'react'
import {TimePicker} from 'antd'
import {createInput} from '../context'
import PropTypes from 'prop-types'
import {localeMoment} from '../../../utils'

@createInput
export class CTimePicker extends Component {

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

  /**
   * 默认参数
   * @type {{format: string}}
   */
  static defaultProps = {
    format: 'HH:mm:ss',
  }

  state = {
    value: null,
  }

  handleChange = (value) => {
    if (value) {
      this.props.onChange(localeMoment(value).format(this.props.format))
    } else {
      this.props.onChange(value)
      this.setState({value})
    }
  }

  componentDidMount() {
    this.setValue(this.props)
  }

  componentWillReceiveProps(props, _) {
    this.setValue(props)
  }

  setValue = (props) => {
    if (props.value) {
      this.setState({value: localeMoment(props.value, this.props.format)})
    }
  }

  render() {
    return (
      <TimePicker
        {...{placeholder: this.props.label, ...this.props}}
        value={this.state.value}
        onChange={this.handleChange}
      />
    )
  }
}

