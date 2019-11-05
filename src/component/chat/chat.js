import React from 'react'
import {List, InputItem, NavBar, Icon, Grid} from 'antd-mobile'
// import io from 'socket.io-client'
import {connect} from 'react-redux'
import { getMsgList, sendMsg, recvMsg, readMsg } from "../../redux/chat.redux";
import {getChatId} from "../../util";

// const socket = io('ws://localhost:9093')

@connect(
	state => state,
	{getMsgList, sendMsg, recvMsg, readMsg}
)
class Chat extends React.Component{

	constructor(props) {
		super(props)
		this.state = {text: '', msg:[]}

		this.onkeyup = this.onkeyup.bind(this)
		this.fixCarousel = this.fixCarousel.bind(this)
	}

	componentDidMount() {
		console.log('component didmount' + this.props.chat.chatmsg.length)
		if (!this.props.chat.chatmsg.length) {
			this.props.getMsgList()
			this.props.recvMsg()
		}
	}

	componentWillUnmount() {
		// 目标用户的id
		const to = this.props.match.params.user
		this.props.readMsg(to)
	}

	fixCarousel() {
		setTimeout(() => {
			window.dispatchEvent(new Event('resize'))
		}, 0)
	}

	handleSubmit() {
		// socket.emit('sendmsg', {text: this.state.text})
		// this.setState({text: ''})
		const from = this.props.user._id
		const to = this.props.match.params.user
		console.log(this.props.user, to)
		const msg = this.state.text
		this.props.sendMsg({from, to, msg})
		this.setState({
			text: '',
			showEmoji: false
		})

	}


	scrollEnd() {
		// 设置滚动条到最低端
		setTimeout(() => {
			var l = document.getElementById('l')
			l.scrollTop = l.scrollHeight
		}, 0)
	}



	onkeyup(e) {
		if (e.keyCode === 13) {
			this.handleSubmit()
		}
	}

	render() {

		console.log('chat render')

		const emoji = '😀 😁 😂 😃 😄 😅 😆 😉 😊 😋 😎 😍 😘 😗 😙 😚 😇 😐 😑 😶 😏 😣 😥 😮 😯 😪  😫 🤬 😈'
				.split(' ').filter(v=>v).map(v => ({text: v}))

		const userid = this.props.match.params.user
		const Item = List.Item
		const Brief = Item.Brief
		const users = this.props.chat.users

		if (!users[userid]) {
			return null
		}

		const chatid = getChatId(userid, this.props.user._id)
		const chatmsgs = this.props.chat.chatmsg.filter(v => {
			return v.chatid === chatid
		})
		return (
			<div id='chat-page'>
				<NavBar
					// style={{position: "absolute", top: 0, width: '100%'}}
					mode='dark'
					icon={<Icon type="left"/>}
					onLeftClick={() => {
						this.props.history.goBack()
					}}
				>
					{users[userid].name}
				</NavBar>
				<List id={'l'} style={{width: '100%', height: '86vh', overflowY:'auto', overflowX:'hidden'}}>
					{
						chatmsgs.map((v, index) => {
							// console.log(v)
							// let to = v.to
							let from = v.from || '5d779226346f48b13614ac4d'
							let tempUser = {...users}
							// console.log(v.from, v.to, userid)
							// delete tempUser[to]
							// const imgName = Object.values(tempUser)[0].avatar
							// console.log(v.from)
							const imgName = tempUser[from].avatar

							const avatar = require(`../img/${imgName}.png`)

							const br = '<br />'

							// 拼接后的消息
							let content = []
							let lock = true
							let count = 0
							v.content.split('').forEach((item) => {
								count += typeof item === 'string' && item.replace(/[\u4e00-\u9fa5]/g,"aa").length
								if (count && count % 36 === 0) {
									content.push(<br />)
								} else {
									content.push(item)
								}
							})
							// console.log(content)

							return v.from === userid ? (
									<Item
										key={index}
										thumb={avatar}
										multipleLine
									>
										<p className={'textLeft'}>
											{
												content.splice(0, 16)
											}
											{
												content
											}
										</p>

									</Item>

							) : (
									<Item
										multipleLine
										key={index}
										className='chat-me'
										extra={<img src={avatar} alt='' />}
									>
										<p className={'textLeft'}>
											{
												content.splice(0, 16)
											}
											{
												content
											}
										</p>

									</Item>
							)
						})
					}
				</List>
				{
					 // this.scrollEnd()
				}

				<div className="stick-footer">
					<List>
						<InputItem
							placeholder='请输入'
							value={this.state.text}
							onChange={v => {
								this.setState({text: v})
							}}
							extra={
								<div>
									<span
										style={{marginRight: 10}}
										onClick={ () => {
											this.setState({showEmoji: !this.state.showEmoji})
											this.fixCarousel()
										}
										}
									>😀</span>
									<span onClick={() => this.handleSubmit()}>发送</span>
								</div>
							}
							onKeyUp={this.onkeyup}
						>
						</InputItem>
					</List>
					{
						this.state.showEmoji ?
							<Grid
								itemStyle={{backgroundColor:'#ddd'}}
								data={emoji}
								columnNum={9}
								carouselMaxRow={4}
								isCarousel={true}
								onClick={el => {
										this.setState({text: this.state.text + el.text})
									}
								}
							/>
						:	null
					}
				</div>
			</div>

		)
	}
}

export default Chat
