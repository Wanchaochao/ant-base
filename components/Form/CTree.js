import React, {Component} from 'react'
import {Tree} from 'antd'
import {createInput} from './context'
import {Process, get, strToFunc} from '../../utils'
import PropTypes from 'prop-types'

const {TreeNode} = Tree

@createInput
export class CTree extends Component {

  state = {
    items: [],

    // 选中
    checkedKeys: [],

    // 展开
    expandedKeys: [],
  }

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

    // 数据信息
    data: PropTypes.array,

    // 获取数据API
    api: PropTypes.func,

    // 处理选中数据
    handleCheckedKeys: PropTypes.func,

    // 处理函数
    mapping: PropTypes.func,

    // 子类名称
    childrenKey: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  }

  /**
   * 设置默认值
   *
   * @type {{childrenKey: string, data: Array}}
   */
  static defaultProps = {
    data: [],

    childrenKey: 'children',
  }

  componentDidMount() {
    const {api} = this.props
    const me = this
    if (api) {
      Process(function* () {
        const data = yield api()
        me.setState({items: data.items})
      }, false)
    }

    this.setValue(this.props)
  }

  /**
   * 处理选中
   * @param checkedKeys
   */
  handleCheck = checkedKeys => {
    const {handleCheckedKeys} = this.props
    if (handleCheckedKeys) {
      checkedKeys = handleCheckedKeys(checkedKeys)
    }

    this.props.onChange(checkedKeys)
  }

  /**
   * 处理展开
   * @param expandedKeys
   */
  handleExpand = expandedKeys => {
    this.setState({expandedKeys})
  }

  componentWillReceiveProps(props, _) {
    this.setValue(props)
  }

  setValue = (props) => {
    this.setState({checkedKeys: props.value || []})
    if (props.expandedKeys && props.expandedKeys.length > 0 && this.state.expandedKeys.length == 0) {
      this.setState({expandedKeys: props.expandedKeys})
    }
  }

  genTree = (data, n) => {

    // 兼容数据
    let {childrenKey} = this.props
    if (Array.isArray(childrenKey)) {
      childrenKey = get(childrenKey, n)
    }

    const children = get(data, childrenKey)
    return (
      <TreeNode {...this.props.mapping(data)}>
        {
          children && children.map(v => this.genTree(v, n + 1))
        }
      </TreeNode>
    )
  }

  render() {

    let dataSource = []
    const {data, api, mapping, handleCheckedKeys, expandedKeys, ...otherProps} = this.props

    // 处理数据
    if (data) {
      dataSource = data
    }

    if (api && this.state.items.length > 0) {
      dataSource = this.state.items
    }

    const {checkedKeys, expandedKeys: stateExpandedKeys} = this.state
    const isHasData = dataSource && dataSource.length > 0
    return (
      <Tree
        onCheck={this.handleCheck}
        onExpand={this.handleExpand}
        checkedKeys={isHasData && checkedKeys.length > 0 ? checkedKeys : []}
        expandedKeys={isHasData && stateExpandedKeys.length > 0 ? stateExpandedKeys : []}
        {...otherProps}
      >
        {dataSource && dataSource.map(item => this.genTree(item, 0))}
      </Tree>
    )
  }
}
