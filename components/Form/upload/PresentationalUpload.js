import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {formConsumer} from '../context'
import {Upload, Icon} from 'antd'
import {Storage} from '../../../../../configs'
import {get} from '../../../utils'


@formConsumer()
export class PresentationalUpload extends Component {
  state = {
    loading: false,
    fileList: [],
    maxLength: 0,
  }

  static propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    maxLength: PropTypes.number,
  }

  static defaultProps = {
    maxLength: 0,
  }

  formatFile = formatFileInfo()
  formatFileList = (v, thumbPrefix) => v.map(item => this.formatFile(item, thumbPrefix))


  handleChange = ({file, fileList}) => {
    let {name, value, form, thumbPrefix} = this.props
    const handles = {
      uploading: () => this.setState({loading: true, fileList}),
      done: () => {
        this.setState({loading: false})
        const code = get(file, 'response.code')

        if (code === 10000) {
          fileList = this.formatFileList(fileList, thumbPrefix)
          if (this.props.maxLength && fileList.length > this.props.maxLength) {
            fileList = fileList.slice(fileList.length - this.props.maxLength)
          }

          this.setState({fileList})
          return this.props.onChange(fileList.map(v => v.pathUrl || v.url))
        }

        if (code === 40003) {

        }

        // 设置错误
        form.setFields({
          [name]: {
            value, errors: [
              {
                'message': get(file, 'response.msg'),
                'field': name,
              },
            ],
          },
        })
      },
      removed: () => {
        fileList = this.formatFileList(fileList)
        this.setState({fileList})
        this.props.onChange(fileList.map(v => v.pathUrl || v.url))
      },
    }
    handles[file.status]()
  }

  getChild() {
    let {loading} = this.state
    return (
      <div>
        <Icon type={loading ? 'loading' : 'plus'}/>
        <div className="ant-upload-text">上传</div>
      </div>
    )
  }

  componentDidMount() {
    this.setFileList(this.props.value)
  }

  componentWillReceiveProps(props) {
    if (this.props.value !== props.value) {
      this.setFileList(props.value)
    }
  }

  setFileList = (value) => {
    this.setState({
      fileList: this.formatFileList(value, this.props.thumbPrefix),
    })
  }

  handleRemove = () => {
    this.setState({fileList: []})
  }

  render() {
    let {name, form, value, onChange, ...otherPorps} = this.props
    return (
      <Upload
        name="file"
        headers={{'Access-Token': Storage.getUser('access_token')}}
        listType="picture-card"
        onChange={this.handleChange}
        fileList={this.state.fileList}
        onRemove={this.handleRemove}
        {...otherPorps}
      >
        {this.getChild()}
      </Upload>
    )
  }
}

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}


const formatFileInfo = (index = 0) => (v, thumbPrefix) => {

  // 如果是定义的 file 结构
  if (typeof v === 'object') {

    if (v.status === 'uploading' || v.status === 'removed') {
      return v
    }

    // 如果是 ant upload 的 file 结构
    if (v.originFileObj) {
      let {uid, name, status, response} = v
      return {
        uid,
        name,
        status,
        url: response.data.url,
        pathUrl: response.data.path,
        thumbUrl: response.data.url,
      }
    }

    if (v.uid) {
      return v
    }

    index++
    return {
      uid: index,
      name: v.url.substr(v.url.lastIndexOf('/') + 1),
      status: 'done',
      url: thumbPrefix + v.url,
      pathUrl: v.url,
      thumbUrl: thumbPrefix + v.url,
    }
  }

  index++

  return {
    uid: index,
    name: v.substr(v.lastIndexOf('/') + 1),
    status: 'done',
    url: thumbPrefix + v,
    pathUrl: v,
    thumbUrl: thumbPrefix + v,
  }

}
