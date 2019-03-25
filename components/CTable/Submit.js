import React, {Component} from 'react'
import {ctableConsumer} from './context'

@ctableConsumer
class Submit extends Component {

  handleClick = () => {
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

export default Submit
