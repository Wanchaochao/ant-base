import React, {Component} from 'react'
import {Select, Icon} from 'antd'
import {get} from '../../../utils/index'
import {createInput} from '../context'
import {dataFormat, Process} from '../../../utils'
import PropTypes from 'prop-types'

@createInput
export class CSelect extends Component {

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

    // 获取数据API
    api: PropTypes.func,
  }

  /**
   * 默认值
   * @type {{data: Array, labelKey: string, valueKey: string}}
   */
  static defaultProps = {
    labelKey: 'label',
    valueKey: 'value',
    data: [],
  }

  state = {
    apiData: [],
  }

  componentDidMount() {
    let {api} = this.props
    let me = this
    if (api) {
      Process(function* () {
        let data = yield api()
        me.setState({apiData: data.items})
      }, false)
    }
  }

  render() {
    const {data, api, labelKey, valueKey, ...otherProps} = this.props

    let dataSource = []

    // 如果data 有数据
    if (data) {
      dataSource = data
    }

    // 如果配置了 api 则走api的数据
    if (api && this.state.apiData.length > 0) {
      dataSource = this.state.apiData
    }

    // 根据 labelKey, valueKey 格式化数据
    dataSource = dataFormat(dataSource, labelKey, valueKey)

    return (
      <Select allowClear {...otherProps}>
        {dataSource.map((v, i) => (
          <Select.Option key={i} value={get(v, 'value')}>
            {get(v, 'label')}
          </Select.Option>
        ))
        }
      </Select>
    )
  }
}

export const CSearchSelect = props => (
  <CSelect
    allowClear
    showSearch={true}
    {...props}/>
)

