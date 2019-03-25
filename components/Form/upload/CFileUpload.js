import React, {Component} from 'react'
import {Upload} from 'antd'
import {createInput} from '../context'

@createInput
export class CFileUpload extends Component {

  render() {
    return (
      <Upload {...this.props}>
        {this.props.children}
      </Upload>
    )
  }
}

