import React from 'react'
import axios from 'axios';
import { withRouter } from 'react-router-dom'
import { loadData } from '../../redux/user.redux'
import { connect } from 'react-redux'


@withRouter
@connect(
  null,
  { loadData }
)
class AuthRoute extends React.Component {

  componentDidMount() {

    const publicList = ['/login', '/register']
    const pathname = this.props.location.pathname
    // 如果用户访问的就是登录或者注册页面 那么不用去请求数据
    if (publicList.indexOf(pathname) > -1) {
      return null
    }

    // 获取用户信息
    axios.get('/user/info').then(res => {
      if (res.status === 200) {
        if (res.data.code === 0) {
          // 有登陆信息
          this.props.loadData(res.data.data)
        } else {
          this.props.history.push('/login')
        }
      }
    })

  }


  

  render() {
    return null
  }

}

export default AuthRoute