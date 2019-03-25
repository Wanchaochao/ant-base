import React, {Component} from 'react'
import {ctableConsumer} from './context'

@ctableConsumer
class Reset extends Component {

  handleClick = () => {
    this.props.ctable.props.form.resetFields()
    return this.props.ctable.fetch()
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        {this.props.children}
      </div>
    )
  }
}

export default Reset
