import {Component} from 'react'
import {Input, Icon} from 'antd'
import {createInput} from './context'
import {password, confirm, Process} from '../../utils'
import PropTypes from 'prop-types'

@createInput
export class CAutoInput extends Component {

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

    // 密码生成长度
    passwordLength: PropTypes.number,

    // 确认询问的信息，没有不是需要确认操作
    confirmMessage: PropTypes.string,
  }

  /**
   * 默认值信息
   * @type {{passwordLength: number}}
   */
  static defaultProps = {
    passwordLength: 8,
  }

  handleClick = () => {
    const {passwordLength, confirmMessage} = this.props
    // 需要确认操作
    if (confirmMessage) {
      const me = this
      Process(function* () {
        const result = yield confirm({
          content: confirmMessage,
        })

        if (result) {
          me.props.onChange(password(passwordLength))
        }
      }, false)
    } else {
      this.props.onChange(password(passwordLength))
    }
  }

  render() {
    const {passwordLength, confirmMessage, ...otherProps} = this.props
    return (
      <Input
        {...{placeholder: this.props.label, ...otherProps}}
        addonAfter={<Icon onClick={this.handleClick} type="redo" style={{fontSize: '16px', color: '#13C2C2'}}/>}/>
    )
  }
}
