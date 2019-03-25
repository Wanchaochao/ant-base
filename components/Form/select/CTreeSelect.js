import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {createInput} from '../context'
import {TreeSelect} from 'antd'
import {Process} from '../../../utils'

const TreeNode = TreeSelect.TreeNode

@createInput
export class CTreeSelect extends Component {

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

    // 获取数据API
    api: PropTypes.func,

    // 数据信息
    data: PropTypes.array,

    // 处理函数
    mapping: PropTypes.func,
  }

  state = {
    items: [],
  }

  componentDidMount() {
    let {api} = this.props
    let me = this
    if (api) {
      Process(function* () {
        const {items} = yield api()
        me.setState({items})
      }, false)
    }
  }

  genTree(data) {
    let {children} = data
    return (
      <TreeNode {...this.props.mapping(data)}>
        {
          children && children.map(v => this.genTree(v))
        }
      </TreeNode>
    )
  }

  render() {

    const {api, data, mapping, ...other} = this.props

    let dataSource = []

    // 如果data 有数据
    if (data) {
      dataSource = data
    }

    // 如果配置了 api 则走api的数据
    if (api && this.state.items.length) {
      dataSource = this.state.items
    }

    return (
      <TreeSelect
        showSearch
        dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
        allowClear
        treeDefaultExpandAll
        {...other}
      >
        {dataSource && dataSource.map(item => this.genTree(item))}
      </TreeSelect>
    )
  }
}
