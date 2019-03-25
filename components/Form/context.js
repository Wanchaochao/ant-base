import React, {Component} from 'react'
import {Form} from 'antd'
import {get, isFunction} from '../../utils'
import hoistNonReactStatics from 'hoist-non-react-statics'

export const FormContext = React.createContext({})
export const CFormContext = React.createContext({})


// 注入 form props
export const formConsumer = () => Comp => {
  return hoistNonReactStatics(class extends Component {
    render() {
      return (
        <FormContext.Consumer>
          {form => (
            <Comp {...this.props} form={form}/>
          )}
        </FormContext.Consumer>
      )
    }
  }, Comp)
}

// 注入 CFormContext value
export const cformConsumer = () => Comp => {

  return hoistNonReactStatics(class extends Component {
    render() {
      return (
        <CFormContext.Consumer>
          {form => (
            <Comp {...this.props} form={form}/>
          )}
        </CFormContext.Consumer>
      )
    }
  }, Comp)
}

// Form.create 包装 ，给提供 FormContext.Provider  注入值
export const cform = (options) => Comp => {
  return hoistNonReactStatics(Form.create(options)(class extends Component {
    getRef() {
      return this.refComp
    }

    render() {
      return (
        <FormContext.Provider value={this.props.form}>
          <Comp ref={v => this.refComp = v} {...this.props}/>
        </FormContext.Provider>
      )
    }
  }), Comp)
}

export const formatValues = (values) => {
  let newVal = {}
  values.forEach(function (field) {
    newVal[field] = {
      value: values[field],
    }
  })
  return newVal
}

// 给 input 注入 form 和 CFormContext 值 , 并且统一处理 Form.Item
export const createInput = Comp => {
  return class extends Component {
    render() {
      const {single = false, show, name, label, itemProps, fieldDecoratorOptions, initialValue: fieldInitValue, ...other} = this.props
      return (
        <FormContext.Consumer>
          {form => {
            // show 属性控制是否渲染
            if (show === undefined || show(form.getFieldsValue())) {
              return (
                <CFormContext.Consumer>
                  {({rules, formItemLayout, formItemProps, initialValue}) => {

                    const formItemPropsMerge = {
                      ...infer(formItemLayout, label),
                      ...get(formItemProps, '*'),
                      ...get(formItemProps, name || '-'),
                      ...itemProps,
                    }

                    const decoratorComp = form.getFieldDecorator(name, {
                      rules: rules ? rules[name] : [],
                      initialValue: fieldInitValue !== undefined ? fieldInitValue : get(initialValue, name),
                      ...fieldDecoratorOptions,
                    })(<Comp {...{name, label, ...other}}/>)

                    // single 属性控制是否使用Form.Item
                    if (single) {
                      return decoratorComp
                    }
                    return (
                      <Form.Item {...formItemPropsMerge} label={label}>
                        {decoratorComp}
                      </Form.Item>
                    )
                  }}
                </CFormContext.Consumer>
              )
            }
          }}
        </FormContext.Consumer>
      )
    }
  }
}

const infer = (data, isReal) => {
  return isReal ? data : {}
}
