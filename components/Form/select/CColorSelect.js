import React, {Component} from 'react'
import {createInput} from '../context'
import PropTypes from 'prop-types'
import {Input, Icon, Tooltip} from 'antd'
import {ChromePicker} from 'react-color'

@createInput
export class CColorSelect extends Component {

  state = {
    color: '#000000',
  }

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

    // 传递给 Select.Option 的参数信息
    optionProps: PropTypes.func,

    // 传递给 form.getFieldDecorator 第二个参数信息
    fieldDecoratorOptions: PropTypes.object,

    // 初始化值
    initialValue: PropTypes.any,
  }

  componentDidMount() {
    const {value} = this.props
    if (value) {
      this.setState({color: value})
    } else {
      this.props.onChange(this.state.color)
    }
  }

  handleChange = ({hex}) => {
    this.props.onChange(hex)
    this.setState({color: hex})
  }

  render() {
    const {color} = this.state
    return (
      <Tooltip placement="rightTop" trigger="click" title={
        <ChromePicker key={this.props.name} color={color} onChange={this.handleChange}/>
      }>
        <span>
          <Input
            style={{width: '130px'}}
            value={color}
            addonAfter={<div style={{backgroundColor: color, width: '14px', height: '14px'}}/>}
          />
        </span>
      </Tooltip>
    )
  }
}
