import {Component} from 'react'
import {DatePicker} from 'antd'
import {localeMoment} from '../../../utils'

const {RangePicker} = DatePicker

export class ViewRangePicker extends Component {

  /**
   * 默认参数
   * @type {{format: string}}
   */
  static defaultProps = {
    format: 'YYYY-MM-DD HH:mm:ss',
  }

  state = {
    value: null,
  }

  handleChange = (value) => {
    if (value.length > 0) {
      this.props.onChange([
        localeMoment(value[0]).format(this.props.format),
        localeMoment(value[1]).format(this.props.format),
      ])
    } else {
      this.props.onChange([])
      this.setState({value: null})
    }
  }

  componentDidMount() {
    if (this.props.defaultTimes) {
      // 如果需要设置默认时间,则设置为当天0点到23:59:59
      this.setValue({value:[localeMoment().format('YYYY-MM-DD 00:00:00'),localeMoment().format('YYYY-MM-DD 23:59:59')]})
    } else {
      this.setValue(this.props)
    }
  }

  componentWillReceiveProps(props, _) {
    this.setValue(props)
  }

  setValue = (props) => {
    if (props.value && props.value.length > 0) {
      const [start_time, end_time] = props.value
      if (start_time && end_time) {
        this.setState({
          value: [
            localeMoment(props.value[0], this.props.format),
            localeMoment(props.value[1], this.props.format),
          ],
        })
      }
    }
  }

  render() {
    return <RangePicker {...this.props} value={this.state.value} onChange={this.handleChange}/>
  }
}
