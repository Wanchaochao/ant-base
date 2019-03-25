import React, {Component} from 'react'
import {Transfer} from 'antd'
import {createInput} from './context'
import {Spin} from 'antd'
import {Process, get, isFunction} from '../../utils'
import PropTypes from 'prop-types'

const listStyle = {
  width: 250,
  height: 300,
}

@createInput
export class CTransfer extends Component {

  static defaultProps = {
    itemsKey: 'items',
    labelKey: 'label',
    valueKey: 'value',
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

    // 传递给 form.getFieldDecorator 第二个参数信息
    fieldDecoratorOptions: PropTypes.object,

    // 初始化值
    initialValue: PropTypes.any,

    // 接口返回数据字段名称
    itemsKey: PropTypes.string,

    // 显示数据字段信息
    labelKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

    // 表单值的字段信息
    valueKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

    // api 接口函数
    api: PropTypes.func.isRequired,
  }

  state = {
    targetKeys: [],
    dataSource: [],
    spinning: true,
  }

  handleChange = (targetKeys, direction, moveKeys) => {
    this.setState({targetKeys})
    this.props.onChange(targetKeys)
  }

  componentDidMount() {
    const me = this
    const {api, labelKey, valueKey, itemsKey} = this.props
    Process(function* () {
      const response = yield api()
      const data = itemsKey ? get(response, itemsKey) : response
      let dataSource = data

      // 当数据不是[{label: '', value: ''}] 形式的时候，格式化数据
      if (labelKey !== 'label' && valueKey !== 'value') {
        dataSource = data.map(item => {
          const title = isFunction(labelKey) ? labelKey(item) : get(item, labelKey)
          const key = isFunction(valueKey) ? valueKey(item) : get(item, valueKey)
          return {key, title}
        })
      }

      me.setState({
        dataSource,
        spinning: false,
      })
    }, false)
  }

  componentWillReceiveProps(props) {
    this.setState({targetKeys: props.value})
  }

  render() {
    const {onChange, api, labelKey, valueKey, itemsKey, ...otherProps} = this.props
    const {spinning, ...stateProps} = this.state

    return (
      <Spin spinning={spinning}>
        <Transfer
          listStyle={listStyle}
          render={item => item.title}
          onChange={this.handleChange}
          showSearch
          {...stateProps}
          {...{placeholder: this.props.label, ...otherProps}}/>
      </Spin>
    )
  }
}
