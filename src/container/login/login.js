import React from 'react'
import Logo from '../../component/logo/logo'
import {List, InputItem, WingBlank, WhiteSpace, Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {login} from '../../redux/user.redux'
import {Redirect} from 'react-router-dom'
import imoocForm from '../../component/imooc-form/imooc-form'

@connect(
	state => state.user,
	{login}
)
@imoocForm
class Login extends React.Component {

	constructor(props) {
		super(props);

		this.register = this.register.bind(this)
		this.handleLogin = this.handleLogin.bind(this)
		this.onkeyup = this.onkeyup.bind(this)
	}

	register() {
		this.props.history.push('/register')
	}


	handleLogin() {
		this.props.login(this.props.state)
	}

	onkeyup(e) {
		if (e.keyCode === 13) {
			this.handleLogin()
		}
	}


	render() {
		return (
			<div>
				{/* 跳转组件 */}
				{(this.props.redirectTo && this.props.redirectTo !== '/login') ? <Redirect to={this.props.redirectTo} /> : null}
				<Logo></Logo>
				<WingBlank>
					<List>
						{this.props.msg ? <p className='error-msg'> {this.props.msg } </p> : null }
						<InputItem
							onChange={v=>this.props.handleChange('user', v)}
							onKeyUp={this.onkeyup}
						>用户</InputItem>
						<InputItem
							onChange={v=>this.props.handleChange('pwd', v)}				
							type="password"
							onKeyUp={this.onkeyup}
						>密码</InputItem>
					</List>
					<WhiteSpace></WhiteSpace>
					<Button 
						type="primary"
						onClick={this.handleLogin}
					>登录</Button>
					<WhiteSpace></WhiteSpace>
					<Button 
						type="ghost"
						onClick={this.register}
					>
						注册
					</Button>
				</WingBlank>
			</div>
		)
	}

}

export default Login