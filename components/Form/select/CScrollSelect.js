import React, {Component} from 'react'
import {createInput} from '../context'
import {isFunction, Process, dataFormat, get} from '../../../utils/index'
import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import {Select, Spin} from 'antd'

@createInput
export class CScrollSelect extends Component {

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

    // 数据显示 label 的字段信息
    labelKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

    // 数据显示 value 的字段信息
    valueKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

    // 获取数据API
    api: PropTypes.func.isRequired,
  }

  /**
   * 默认值
   * @type {{labelKey: string, valueKey: string}}
   */
  static defaultProps = {
    labelKey: 'label',
    valueKey: 'value',
  }

  // 分页信息
  page = 0

  // 搜索关键字
  keyword = ''

  state = {
    // 数据信息
    data: [],

    // 是否加载中
    fetching: true,
  }

  constructor(props) {
    super(props)
    this.getApiResource = debounce(this.getApiResource, 800)
    const {value} = this.props
    if (value) {
      this.getApiResource(value)
    }
  }

  // 10 ms
  getApiResource = (value = '') => {
    const {api, filters, labelKey, valueKey, name} = this.props
    const me = this
    Process(function* () {
      me.page = me.page + 1
      const response = yield api({
        page: me.page,
        keyword: me.keyword,
        [name]: value,
        ...filters,
      })

      me.setState({
        fetching: false,
        data: [
          ...me.state.data,

          // 处理数据
          ...dataFormat(response.items, labelKey, valueKey),
        ],
      })
    }, false)
  }

  /**
   * 滚动处理
   * @param e
   */
  onPopupScroll = (e) => {
    const scrollTop = e.target.scrollHeight - e.target.clientHeight
    if (e.target.scrollTop >= scrollTop) {
      this.getApiResource()
    }
  }

  handleSearch = (keyword) => {
    this.setState({fetching: true, data: []}, () => {
      this.keyword = keyword
      this.page = 0
      this.getApiResource()
    })
  }

  handleOnFocus = () => {
    this.handleSearch('')
  }

  render() {
    const {api, filters, optionProps, ...otherProps} = this.props
    let optProps = {}
    return (
      <Select
        {...otherProps}
        filterOption={false}
        showSearch={true}
        onPopupScroll={this.onPopupScroll}
        onSearch={this.handleSearch}
        onFocus={this.handleOnFocus}
        notFoundContent={this.state.fetching ? <Spin size="small"/> : null}
        loading={!!(this.state.fetching && get(otherProps, 'value'))}
        allowClear={true}
      >
        {
          this.state.data.map((v, i) => {
            if (isFunction(optionProps)) {
              optProps = optionProps(v)
            }
            return (<Select.Option {...optProps} value={v.value} key={i}>{v.label}</Select.Option>)
          })
        }
      </Select>
    )
  }
}
