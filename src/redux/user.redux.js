import axios from "axios";
import { getRedirectPath } from '../util'


const AUTH_SUCCESS = 'AUTH_SUCCESS'
const LOGOUT = 'LOGOUT'
const ERROR_MSG = 'ERROR_MSG'
const LOAD_DATA = 'LOAD_DATA'

const MODIFY = 'MODIFY'

const initState = {
  redirectTo: '',
  isAuth: false,
  msg: '',
  user: '',
  type: ''
}

// reducer 
export function user(state = initState, action) {
  switch(action.type) {
    case AUTH_SUCCESS:
      return {...state, msg:'', redirectTo: getRedirectPath(action.payload), ...action.payload}
    
    case LOAD_DATA:
      return {...state, ...action.payload}
    case ERROR_MSG:
      return {...state, isAuth: false, msg: action.msg}
    case LOGOUT:
      return {...initState, redirectTo: '/login'}
    case MODIFY:
      return {...state, redirectTo: '/me', isAuth: true}
    default:
      return state
  }
}

function authSuccess(obj) {
  // 过滤掉pwd数据
  const {pwd, ...data} = obj 
  return {type: AUTH_SUCCESS, payload: data}
}


function errorMsg(msg) {
  return {msg, type: ERROR_MSG}
}

export function userinfo() {
  // 获取用户信息
  axios.get('/user/info').then(res => {
    if (res.status === 200) {
      if (res.data.code === 0) {
        // 有登陆信息
      } else {
        this.props.loadData(res.data.data)
        this.props.history.push('/login')
      }
    }
  })
  
  
      // 是否登录
    // 现在的url地址 login是不需要跳转的
    // 用户的type 身份是boss还是牛人
    // 用户是否完善信息 （选择头像 个人简介）
}


export function loadData(userinfo) {
  return {type: LOAD_DATA, payload: userinfo}
}

export function logoutSubmit() {
  return {type: LOGOUT}
}



export function update(data) {
  return dispatch => {
    axios.post('/user/update', data)
      .then(res => {
        if (res.status === 200 && res.data.code === 0) {
          dispatch(authSuccess(res.data.data))
        } else {
          dispatch(errorMsg(res.data.msg))
        }
      })
  }
}

// 派发登录action
export function login({user, pwd}) {
  if (!user || !pwd) {
    return errorMsg('用户密码必须输入')
  }

  return dispatch => {
    axios.post('/user/login', {user, pwd}).then((res) => {
      if (res.status === 200 && res.data.code === 0) {
        // dispatch(registerSuccess({user, pwd, type}))
        dispatch(authSuccess(res.data.data))
      } else {
        dispatch(errorMsg(res.data.msg))
      }
    })
  }

}

export function modifyMsg({user, pwd, repeatpwd, type}) {
  if (!pwd || !type) {
    return errorMsg('密码必须输入')
  }
  if (pwd !== repeatpwd) {
    return errorMsg('密码和确认密码不一致')
  }
  // 判断密码的长度是否符合规定长度
  if (pwd.length > 16 || pwd.length < 3) {
    return errorMsg('密码长度必须在3-16位')
  }

  return dispatch => {
    // 将数据发送到数据库成功后 更新store
    axios.post('/user/modify', {user, pwd, type}).then((res) => {
      if (res.status === 200 && res.data.code === 0) {
        dispatch(authSuccess({user, pwd, type}))
      } else {
        dispatch(errorMsg(res.data.msg))
      }
    })
  }
}


export function register({user, pwd, repeatpwd, type}) {
  if (!user || !pwd || !type) {
    return errorMsg('用户名密码必须输入')
  }
  if (pwd !== repeatpwd) {
    return errorMsg('密码和确认密码不一致')
  }
  // 判断密码的长度是否符合规定长度
  if (pwd.length > 16 || pwd.length < 3) {
    return errorMsg('密码长度必须在3-16位')
  }

  return dispatch => {
    axios.post('/user/register', {user, pwd, type}).then((res) => {
      if (res.status === 200 && res.data.code === 0) {
        dispatch(authSuccess({user, pwd, type}))
      } else {
        dispatch(errorMsg(res.data.msg))
      }
    })
  }

}
















