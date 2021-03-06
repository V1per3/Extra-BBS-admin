import React from 'react'
import { Table, Avatar, Tag, Tooltip, Space, Input, message, Modal, Button } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { getPostList, updatePost, deletePost } from 'api/post'

import styles from './blacklist.styl'
import { getPost } from '../../../api/post'

const { Search } = Input
const { confirm } = Modal

class List extends React.Component {

  formRef = React.createRef()

  state = {
    loading: false,
    pageNum: 1,
    pageSize: 10,
    total: 0,
    keyword: '',
    status: 0,
    postList: [],
    modalVisible: false,
    modalPost: {
      id: 0,
      uid: 0,
      uname: '',
      avatar: '',
      title: '',
      content: '',
      md: '',
      create_time: '',
      update_time: '',
      pv: 0,
      likes: 0,
      collects: 0,
      answers: 0,
      topic_id: 0,
      topic_name: '',
      status: 0
    }
  }

  componentDidMount(){
    this.getPostList()
  }

  handleTableChange = (pagination) => {
    this.setState({
      pageNum: pagination.current
    }, () => {
      this.getPostList()
    })
  }

  getPostList = () => {
    this.setState({
      loading: true
    })
    const data = {
      page_num: this.state.pageNum,
      page_size: this.state.pageSize,
      keyword: this.state.keyword,
      status: this.state.status
    }
    getPostList(data).then(response => {
      if(response.data.status === 200){
        let list = response.data.message.list
        for(let i=0; i<list.length; i++){
          if(list[i].avatar === null){
            list[i].avatar = ''
          }
          if(list[i].bg === null){
            list[i].bg = ''
          }
        }
        this.setState({
          postList: list,
          pageNum: response.data.message.page_num,
          pageSize: response.data.message.page_size,
          total: response.data.message.total
        })
      }else if(response.data.status == 10003){
        this.setState({
          postList: []
        })
      }else{
        message.warning(response.data.message)
      }
      this.setState({
        loading: false
      })
    }).catch(error => {
      console.log(error)
      message.error('?????????????????????????????????')
      this.setState({
        loading: false
      })
    })
  }

  updatePost = (e) => {
    const post = JSON.parse(e.target.getAttribute('post'))
    const that = this
    confirm({
      title: '??????',
      icon: <ExclamationCircleOutlined />,
      content: `?????????????????????${post.title}??????????????????`,
      okText: '??????',
      cancelText: '??????',
      async onOk() {

        that.setState({
          loading: true
        })

        let data

        await getPost(post.id).then(response => {
          if(response.data.status === 200){
            let res = response.data.message
            data = {
              title: res.title,
              content: res.content,
              md: res.md,
              topic_id: res.topic_id,
              status: 1
            }
          }else{
            message.warning(response.data.message)
            that.setState({
              loading: false
            })
            return
          }
        }).catch(error => {
          message.error('?????????????????????????????????')
          that.setState({
            loading: false
          })
          return
        })

        updatePost(post.id, data).then(response => {
          if(response.data.status == 200){
            message.success(`?????????${post.title}?????????????????????`)
            that.getPostList()
          }else{
            message.warning(response.data.message)
          }
          that.setState({
            loading: false
          })
        }).catch(error => {
          console.log(error)
          message.error('?????????????????????????????????')
          that.setState({
            loading: false
          })
        })

      },
      onCancel() {
        message.info(`?????????${post.title}????????????????????????`)
      }
    })
  }

  search = value => {
    this.setState({
      keyword: value.trim()
    }, () => {
      this.getPostList()
    })
  }

  goUpdatePost = (e) => {
    const post = JSON.parse(e.target.getAttribute('post'))
    if(!window.frontendUrl){
      message.warning('???????????????????????????config.js??????????????????????????????')
      return 
    }
    window.open(`${window.frontendUrl}/#/update-post?id=${post.id}`)
  }

  goPostDetail = (e) => {
    if(!window.frontendUrl){
      message.warning('???????????????????????????config.js??????????????????????????????')
      return 
    }
    window.open(`${window.frontendUrl}/#/post/${this.state.modalPost.id}`)
  }

  showModal = async (e) => {
    let post = JSON.parse(e.target.getAttribute('post'))
    await getPost(post.id).then(response => {
      if(response.data.status === 200){
        post.content = response.data.message.content
      }else{
        post.content = '????????????????????????'
      }
    }).catch(error => {
      post.content = '????????????????????????'
    })
    this.setState({
      modalPost: post,
      modalVisible: true
    })
  }

  handleModalCancel = () => {
    this.setState({
      modalVisible: false
    })
  }

  render() {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: id => (
          <Tooltip placement="topLeft" title={id}>
            <span>{id}</span>
          </Tooltip>
        )
      },
      {
        title: '??????',
        dataIndex: 'title',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: title => (
          <Tooltip placement="topLeft" title={title}>
            <span>{title}</span>
          </Tooltip>
        )
      },
      {
        title: '??????',
        dataIndex: 'uname',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: uname => {
          return (
            <Tooltip placement="topLeft" title={uname}>
              <span>{uname}</span>
            </Tooltip>
          )
        },
      },
      {
        title: '??????',
        dataIndex: 'avatar',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: avatar => (
          <Avatar src={avatar} />
        ),
      },
      {
        title: '??????',
        dataIndex: 'topic_name',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: topic_name => (
          <Tooltip placement="topLeft" title={topic_name}>
            <span>{topic_name}</span>
          </Tooltip>
        )
      },
      {
        title: '?????????',
        dataIndex: 'pv',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: pv => {
          return (
            <Tooltip placement="topLeft" title={pv}>
              <span>{pv}</span>
            </Tooltip>
          )
        },
      },
      {
        title: '?????????',
        dataIndex: 'likes',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: likes => {
          return (
            <Tooltip placement="topLeft" title={likes}>
              <span>{likes}</span>
            </Tooltip>
          )
        }
      },
      {
        title: '?????????',
        dataIndex: 'collects',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: collects => {
          return (
            <Tooltip placement="topLeft" title={collects}>
              <span>{collects}</span>
            </Tooltip>
          )
        }
      },
      {
        title: '?????? / ??????',
        dataIndex: 'answers',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: answers => {
          return (
            <Tooltip placement="topLeft" title={answers}>
              <span>{answers}</span>
            </Tooltip>
          )
        }
      },
      {
        title: '????????????',
        dataIndex: 'create_time',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: create_time => (
          <Tooltip placement="topLeft" title={create_time}>
            <span>{create_time}</span>
          </Tooltip>
        )
      },
      {
        title: '????????????',
        dataIndex: 'update_time',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: update_time => (
          <Tooltip placement="topLeft" title={update_time}>
            <span>{update_time}</span>
          </Tooltip>
        )
      },
      {
        title: '????????????',
        dataIndex: 'status',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: (status, record) => {
          if(record.status === 1){
            return (
              <Tag color="green">??????</Tag>
            )
          }else{
            return (
              <Tag color="gray">?????????</Tag>
            )
          }  
        }
      },
      {
        title: '??????',
        dataIndex: 'action',
        align: 'center',
        width: 150,
        render: (text, record) => (
          <Space size="middle">
            <a post={JSON.stringify(record)} onClick={this.showModal}>??????</a>
            <a post={JSON.stringify(record)} onClick={this.goUpdatePost}>??????</a>
            <a style={{color: "#F2AA24"}} post={JSON.stringify(record)} onClick={this.updatePost}>??????</a>
          </Space>
        ),
      }
    ]

    return (
      <>
        <div className={styles.container}>
          <div className={styles.header}>???????????????</div>
          <Search className={styles.search} placeholder="??????????????????" onSearch={value => {this.search(value)}} enterButton />
          <Table 
            className={styles.table}
            columns={columns} 
            dataSource={this.state.postList} 
            rowKey="id"
            pagination={{
              current: this.state.pageNum,
              pageSize: this.state.pageSize,
              total: this.state.total,
              position: ['bottomCenter']
            }}
            loading={this.state.loading}
            onChange={this.handleTableChange}
          />
        </div>

        <Modal
          title="????????????"
          width="80vw"
          visible={this.state.modalVisible}
          footer= ''
          onCancel={this.handleModalCancel}
          maskClosable={false}
        > 
          <h1 align="center">{this.state.modalPost.title}</h1>
          <div className={styles.markdownBody} dangerouslySetInnerHTML={{__html: this.state.modalPost.content}}></div>
          <Button className={styles.commentButton} type="primary" onClick={this.goPostDetail}>????????????</Button>
        </Modal>
      </>
    )
  }
}

export default List;