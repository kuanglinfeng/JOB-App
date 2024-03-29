
import  React  from "react";
import {Grid, List} from 'antd-mobile'
import PropTypes from 'prop-types'

class AvatarSelector extends React.Component {

  // 类型约束
  static propTypes = {
    selectAvatar: PropTypes.func.isRequired,

  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {

    const avatarList = 'boy,girl,bald,beauty,cute,handsome,knowledge,good,sweet,bull,cat,chick,dog,pig,zebra'
                        .split(',')
                        .map(v => ({
                          icon: require(`../img/${v}.png`),
                          text: v
                        }))
    const gridHeader = this.state.icon ? (
                                          <div>
                                              <span>已选择头像</span>
                                              <img style={{width:20}} src={this.state.icon} alt=""/>
                                           </div>
                                          )
                                       : '请选择头像'
    return (
      <div>
        <List renderHeader={() => gridHeader}>
        <Grid 
          data={avatarList} 
          columnNum={5} 
          onClick={
          ele => {
            this.setState(ele)
            this.props.selectAvatar(ele.text)
          }} 
        />
        </List>
      </div>
    )
  }

}

export default AvatarSelector