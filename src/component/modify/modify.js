import React from 'react'
import BossInfo from '../../container/bossinfo/bossinfo'
import GeniusInfo from '../../container/geniusinfo/geniusinfo'
import { connect } from 'react-redux'

@connect(
	state => state.user
)
class Modify extends React.Component {

	constructor(props) {
		super(props)
	}


	render() {
		return this.props.type === 'genius' ? <GeniusInfo/> : <BossInfo/>
	}
}

export default Modify