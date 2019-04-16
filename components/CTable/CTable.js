import React, {Component, Fragment} from 'react'
import {Table, message} from 'antd'
import PropTypes from 'prop-types'
import {Process, get, renderButtons} from '../../utils'
import {CTableContext} from './context'
import Submit from './Submit'
import Reset from './Reset'
import ButtonItem from './ButtonItem'
import {CForm} from '../Form'

@CForm.create()
class CTable extends Component {
  static Submit = Submit
  static Reset = Reset
  static ButtonItem = ButtonItem

  /**
   * 验证传入类型
   *
   * @type {{}}
   */
  static propTypes = {
    // api 处理
    api: PropTypes.func.isRequired,

    // 列配置信息
    columns: PropTypes.array.isRequired,

    // 唯一索引
    index: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]).isRequired,

    // 查询条件
    filters: PropTypes.object,

    // 操作按钮点击事件
    btnClick: PropTypes.func,
  }

  state = {
    dataSource: [],
    pagination: {},
    loading: false,
    order: '',
    filter: {},
    columns: [],
  }

  componentDidMount() {
    // 执行一次计算就好了
    this.setState({
      pagination: {
        showTotal: (total) => {return '总数' + total},
        ...this.props.pagination,
      },
      columns: this.handleColumns(),
    })

    this.fetch()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    /* 监听prevProps.columns 修改 */
    if (prevProps.columns !== this.props.columns) {
      this.setState({columns: this.handleColumns()})
    }
  }

  handleColumns = () => {
    return this.props.columns.map(item => {
      const {_render, ...other} = item
      if (_render) {
        other.render = (...params) => renderButtons(this.props.btnClick, _render)(...params)
      }
      return other
    })
  }

  /**
   * 表格变动(排序、分页、筛选)
   * @param pagination
   * @param filters
   * @param sorter
   */
  handleChange = (pagination, filters, sorter) => {
    const pager = {...this.state.pagination}
    pager.current = pagination.current

    let {order} = this.state

    // 排序需要从第一页处理
    if (sorter.field && sorter.order) {
      filters.order = `${sorter.field} ${sorter.order.replace('end', '')}`
      if (order !== filters.order) {
        pager.current = 1
        pagination.current = 1
        order = filters.order
      }
    }

    this.setState({
      pagination: pager,
      order,
      filter: filters,
    })

    this.fetch({
      page_size: pagination.pageSize,
      page: pagination.current,
      filter: filters,
    })
  }

  /**
   * 获取数据
   * @param params
   */
  fetch = (params = {}) => {
    this.setState({loading: true})
    const me = this
    const pagination = {...this.state.pagination}

    // 查询条件
    params.filter = {
      ...params.filter,
      ...this.state.filter,
      ...this.props.form.getFieldsValue(),
      ...this.props.filters,
    }

    Process(function* () {
      try {
        const response = yield me.props.api(params)

        let newPagination = false
        if (response.page) {
          newPagination = {
            ...pagination,
            ...response.page,
          }
        }

        me.setState({
          loading: false,
          dataSource: response.items,
          pagination: newPagination,
        })
      } catch (e) {
        message.error(get(e,'msg'))
        me.setState({loading: false})
      }
    }, false)
  }

  render() {
    const {api, columns, index, filters, btnClick, pagination, ...otherProps} = this.props
    return (
      <Fragment>
        {this.props.children && <CTableContext.Provider value={{ctable: this}}>
          <div style={{marginBottom: '24px', overflow: 'hidden', lineHeight: '40px'}}>
            {this.props.children}
          </div>
        </CTableContext.Provider>}
        <Table
          style={{clear: 'both'}}
          rowKey={index}
          loading={this.state.loading}
          dataSource={this.state.dataSource}
          columns={this.state.columns}
          pagination={this.state.pagination}
          onChange={this.handleChange}
          {...otherProps}
        />
      </Fragment>
    )

  }
}

export default CTable
