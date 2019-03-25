import {Component, Fragment} from 'react'
import {createInput} from './context'
import {Input, Row, Col} from 'antd'
import PropTypes from 'prop-types'

@createInput
export class CRangeNumber extends Component {


  state = {
    max: '',
    min: '',
  }

  /**
   * 默认值
   * @type {{data: Array, labelKey: string, valueKey: string}}
   */
  static defaultProps = {
    disabled: false,
    width: '100%',
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

    // 宽度
    width: PropTypes.PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    //是否禁用
    disabled: PropTypes.bool,
  }


  handleMinChange = (v) => {
    this.handleChange(v, 'min')
  }

  handleMaxChange = (v) => {
    this.handleChange(v, 'max')
  }

  handleChange(v, name) {
    this.setState({
      [name]: v.target.value,
    }, () => {
      this.props.onChange([this.state.min, this.state.max])
    })
  }

  componentDidMount() {
    this.watchValue(this.props)
  }

  componentWillReceiveProps(props) {
    this.watchValue(props)
  }

  watchValue(props) {
    if (Array.isArray(props.value)) {
      this.setState({
        min: props.value[0],
        max: props.value[1],
      })
    }
  }


  render() {
    let {width, disabled} = this.props

    return (
      <Fragment>
        <Row style={{width}}>
          <Col span={11}>
            <Input onChange={this.handleMinChange} disabled={disabled} value={this.state.min}/>
          </Col>
          <Col span={2} style={{textAlign: 'center'}}>
            -
          </Col>
          <Col span={11}>
            <Input onChange={this.handleMaxChange} disabled={disabled} value={this.state.max}/>
          </Col>
        </Row>
      </Fragment>
    )
  }
}
