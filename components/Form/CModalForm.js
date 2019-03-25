import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Modal} from 'antd'
import {CForm} from './CForm'


const setConf = (conf, v, k = '') => {
  if (v === undefined) {
    return conf
  }

  if (k === '') {
    return {...conf, ...v}
  }

  if (typeof v === 'object') {
    return {...conf, ...v}
  } else {
    conf[k] = v
  }
  return conf
}

@CForm.create()
export const CModalForm = WrappedComponent => {
  return class extends Component {
    state = {
      visible: false,
      conf: {
        okText: '提交',
      },
    }

    static defaultProps = {
      // modal 的宽度
      width: 598,
    }

    /**
     * 类型验证
     * @type {{handleSubmit: *, visible: *}}
     */
    static propTypes = {
      // 成功处理
      onOk: PropTypes.func.isRequired,
    }

    close = () => {
      this.setState({
        visible: false,
      })
    }

    open = (...args) => {
      let conf = {}
      if (args.length >= 2) {
        conf = setConf(conf, args[0], 'action')
        conf = setConf(conf, args[1], 'title')
        conf = setConf(conf, args[2], 'okText')
        conf = setConf(conf, args[3])
      } else {
        conf = args[0]
      }

      this.setState({
        visible: true,
        conf: {...this.state.conf, ...conf},
      }, () => {
        conf.callbackFunc && conf.callbackFunc(this)
      })
    }

    getForm = () => {
      return this.props.form
    }

    getConf = () => {
      return this.state.conf
    }

    /**
     * 表单成功处理
     */
    handleOk = () => {
      const {form, onOk} = this.props
      form.validateFieldsAndScroll((err, fieldsValue) => {
        if (err) return
        onOk(fieldsValue, this)
      })
    }

    render() {
      const {onOk, ...otherProps} = this.props
      return (
        <Modal
          destroyOnClose
          onOk={this.handleOk}
          title={this.state.conf.title}
          okText={this.state.conf.okText}
          visible={this.state.visible}
          onCancel={this.close}
          maskClosable={false}
          {...otherProps}
        >
          <WrappedComponent {...otherProps} config={this.state.conf} modalFormSubmit={this.handleOk}/>
        </Modal>)
    }
  }
}
