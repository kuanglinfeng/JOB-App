import  React from "react";
import {Card, WhiteSpace, WingBlank} from 'antd-mobile'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'

@withRouter
class UserCard extends React.Component {

  static propTypes = {
    userlist: PropTypes.array.isRequired
  }

  handleClick(v) {
    this.props.history.push(`/chat/${v._id}`)
  }

  render() {
    return (
      <WingBlank>
      <WhiteSpace></WhiteSpace>
        <div style={{width: '100%', height: '82vh', overflowY:'auto', overflowX:'hidden'}}>
      {

          this.props.userlist.map(v => (
          v.avatar ?
          <Card key={v._id} onClick={() => this.handleClick(v)}>
            <Card.Header
              title={v.user}
              thumb={require(`../img/${v.avatar}.png`)}
              thumbStyle={{width:40}}
              extra={<span>{v.title}</span>}
            >
            </Card.Header>
            <Card.Body>
              {
                v.type === 'boss' ? <div>公司:{v.company}</div> : null
              }
              {
                v.type === 'boss' ? <span>招聘需求: </span> : <span>工作技能: </span>
              }
              { v.desc.split('\n').map(d => (
                <div key={d}>{d}</div>
              ))}
              {
                v.type === 'boss' ? <div>薪资:{v.money}</div> : null
              }
            </Card.Body>
          </Card> : null

          ))
      }
        </div>
    </WingBlank>
    )
  }


}


export default UserCard