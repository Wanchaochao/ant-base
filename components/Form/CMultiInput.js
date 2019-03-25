import React, {Component, Fragment} from 'react'
import {Input, Button, Row, Col} from 'antd'
import PropTypes from 'prop-types'
import {createInput} from './context'
import {get} from '../../utils'

@createInput
export class CMultiInput extends Component {

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

    // 设置表单Inputs 信息
    inputs: PropTypes.array.isRequired,

    // 数据信息
    list: PropTypes.array,
  }

  static defaultProps = {
    list: [{}],
  }

  state = {
    list: [{}],
  }

  /**
   * 设置列表信息
   *
   * @param list
   */
  setList = (list) => {
    this.setState({list}, () => {
      this.props.onChange(this.state.list.map(item => this.getInputValue(item)))
    })
  }

  getInputValue = (item = {}) => {
    const {inputs} = this.props
    let objectValue = {}
    inputs.forEach(input => {
      const {name} = input
      objectValue[name] = get(item, name)
    })

    return objectValue
  }

  componentDidMount() {
    if (this.props.list && this.props.list.length > 0) {
      this.setList(this.props.list)
    }
  }

  handleCreate = () => {
    this.setState({list: [...this.state.list, this.getInputValue()]})
  }

  handleRemove = (index) => {
    this.setState({
      list: this.state.list.filter((v, k) => index != k),
    }, () => {
      this.props.onChange(this.state.list.filter((v, k) => index != k))
    })
  }

  handleChange = (index, name, e) => {
    const list = this.state.list.map((item, key) => {
      if (index === key) {
        item[name] = e.target.value
      }

      return item
    })

    this.setList(list)
  }

  render() {
    const {inputs} = this.props
    const {list} = this.state
    return (
      <Fragment>
        {list.map((item, index) => {
          return (
            <Row key={index}>
              <Col span={18}>
                <Input.Group compact>
                  {inputs.map((labelItem, labelIndex) => {
                    const {name, ...otherProps} = labelItem
                    return (
                      <Input
                        key={labelIndex}
                        value={get(item, name)}
                        onChange={this.handleChange.bind(this, index, name)}
                        {...otherProps}
                      />
                    )
                  })}
                </Input.Group>
              </Col>
              <Col sapn={3}>
                {index === 0 ? <Button type={'primary'} onClick={this.handleCreate} htmlType={'button'}>新增</Button> :
                  <Button type={'danger'} onClick={this.handleRemove.bind(this, index)} htmlType={'button'}>删除</Button>}
              </Col>
            </Row>
          )
        })}
      </Fragment>
    )
  }
}
