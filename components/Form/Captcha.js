import React, {Component} from 'react'
import {Form, Input} from 'antd'
import {Process} from '../../utils'
import PropTypes from 'prop-types'

export class Captcha extends Component {
  state = {
    captcha: '',
    id: '',
  }

  static propTypes = {
    /**
     * 表单名称不能为空
     */
    name: PropTypes.string.isRequired,

    /**
     * api 处理不能为空
     */
    api: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.handleChange()
  }

  /**
   * 换一张图片
   */
  handleChange = () => {
    const me = this
    Process(function* () {
      const response = yield me.props.api()
      me.setState(response)
    }, false)
  }

  render() {
    const {form, rules, name, label} = this.props
    return (
      <Form.Item key={name} label={label}>
        {form.getFieldDecorator(name, {rules, validateTrigger: 'onSubmit'})(
          <div style={{display: 'flex'}}>
            <Input
              size="large"
              placeholder={'请输入' + (label || '验证码')}
              style={{marginRight: '10px', width: 'auto'}}
            />
            <img style={{display: 'inline-block', width: '80px', height: 'auto'}}
                 src={this.state.captcha} alt="点击图片换一张" onClick={this.handleChange}/>
            <a style={{display: 'inline-block', marginLeft: '10px'}} onClick={this.handleChange}>换一张</a>
          </div>,
        )}
      </Form.Item>
    )
  }
}
