import React from 'react'
import {connect} from 'react-redux'
import {Result, List, WhiteSpace, Modal} from 'antd-mobile'
import {logoutSubmit} from '../../redux/user.redux'
import {Redirect} from 'react-router-dom'


@connect(
  state => state.user,
  {logoutSubmit}
)
class User extends React.Component {

  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
    this.modify = this.modify.bind(this)
  }

  logout() {
    const alert = Modal.alert

    alert('注销', '确认退出登录吗？？？', [
      {text: '取消', onPress: () => console.log('cancel')},
      {text: '确认', onPress: () => {
        // 擦除id
        // browserCookie.erase('userid')
        this.props.logoutSubmit()
      }}
    ])

  }

  modify() {
    this.props.history.push(`/me/modify`)
  }


  render() {
    const props = this.props
    const Item = List.Item
    const Brief = Item.Brief

    return props.user ? (
      <div>
        <Result
          img={<img className='user-icon' src={require(`../img/${props.avatar}.png`)} alt="" />}
          title={this.props.user}
          message={props.type === 'boss' ? props.company : null}
        />
        <List renderHeader={() => '简介'}>
          <Item
            multipleLine
          >
            {
              props.type === 'boss' ? '招聘职位: ' + props.title : props.title
            }
            {
              props.desc.split('\n').map(v =>
                <Brief key={v}>{v.desc}</Brief>
              )
            }
            {
              props.money ? <Brief>薪资:{props.money}</Brief> : null
            }

          </Item>
        </List>
        <WhiteSpace></WhiteSpace>
        <List>
          {/*<Item onClick={this.modify}>修改信息</Item>*/}
          <Item onClick={this.logout}>退出登录</Item>
        </List>
          
 
      </div>
    ) : <Redirect to={props.redirectTo}> </Redirect>
  }

}


export default User