import React, {Component} from 'react'
import {ctableConsumer} from './context'
import CTable from './CTable'
import {Form, Button} from 'antd'

@ctableConsumer
class ButtonItem extends Component {
  render() {
    return (
      <Form.Item {...this.props}>
        <Button type="primary">
          <CTable.Submit>
            查询
          </CTable.Submit>
        </Button>
        <Button style={{marginLeft: 8}}>
          <CTable.Reset>
            重置
          </CTable.Reset>
        </Button>
      </Form.Item>
    )
  }
}

export default ButtonItem
