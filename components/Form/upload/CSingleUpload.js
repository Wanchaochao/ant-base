import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {PresentationalUpload} from './PresentationalUpload'
import {createInput} from '../context'


@createInput
export class CSingleUpload extends Component {

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

    // api
    action: PropTypes.string.isRequired,
  }

  state = {
    value: [],
  }

  handleChange = (v) => {
    if (v.length > 0) {
      this.props.onChange(v[0])
    } else {
      this.props.onChange('')
    }
  }

  componentDidMount() {
    this.setValue(this.props)
  }

  componentWillReceiveProps(props) {
    if (props.value !== this.props.value) {
      this.setValue(props)
    }
  }

  setValue = (props) => {
    if (props.value) {
      this.setState({value: [props.value]})
    }
  }

  render() {
    let {value, onChange, ...otherProps} = this.props
    return (
      <PresentationalUpload
        {...otherProps}
        value={this.state.value}
        onChange={this.handleChange}
        maxLength={1}
      />
    )
  }
}
