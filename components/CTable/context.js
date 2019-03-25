import React from 'react'
export const CTableContext = React.createContext({})

export const ctableConsumer = (Comp) => {
  return props => {
    return (
      <CTableContext.Consumer>
        {
          ({ctable}) => {
            return (<Comp {...props} ctable={ctable}/>)
          }
        }
      </CTableContext.Consumer>
    )
  }
}
