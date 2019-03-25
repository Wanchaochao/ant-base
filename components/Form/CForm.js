import {Component} from 'react'
import {Form} from 'antd'
import {cform, CFormContext, formConsumer} from './context'
import * as PropTypes from 'prop-types'


@formConsumer() // 注入 form 属性
export class CForm extends Component {
  static propTypes = {
    // 表单Form.Item 配置信息
    formItemLayout: PropTypes.object,

    // 表单初始值对象
    initialValue: PropTypes.object,

    // 验证规则信息
    rules: PropTypes.object,

    // 单个和统一的Form.Item 的配置信息
    formItemProps: PropTypes.object,

    /**
     * 表单提交处理
     */
    onSubmit: PropTypes.func,
  }

  static create = cform

  static defaultProps = {
    // 默认的样式
    formItemLayout: {
      labelCol: {span: 5, offset: 0},
      wrapperCol: {span: 19, offset: 0},
    },
  }

  filterItemProps = (item, layout) => {
    if (layout === 'vertical' || layout === 'inline') {
      return {label: item.label}
    }
    return item
  }

  // 包装 antd form的submit
  handleSubmit = (e) => {
    e.preventDefault()
    const {onSubmit} = this.props
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err && onSubmit) {
        onSubmit(values)
      }
    })
  }

  render() {
    const {formItemLayout, rules, initialValue, formItemProps, ...formProps} = this.props
    return (
      <Form {...{...formProps, onSubmit: this.handleSubmit}}>
        <CFormContext.Provider
          value={{
            rules,
            formItemProps,
            initialValue,
            formItemLayout: this.filterItemProps(formItemLayout, this.props.layout),
          }}>
          {this.props.children}
        </CFormContext.Provider>
      </Form>
    )
  }
}
