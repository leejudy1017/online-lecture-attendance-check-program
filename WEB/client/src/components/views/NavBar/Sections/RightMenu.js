/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

function RightMenu(props) {
	const user = useSelector((state) => state.user);
	const location = useLocation();
	const logoutHandler = () => {
		axios.get(`${USER_SERVER}/logout`).then((response) => {
			if (response.status === 200) {
				props.history.push('/login');
			} else {
				alert('로그아웃 실패');
			}
		});
	};

	if (user.userData && !user.userData.isAuth) {
		return (
			<Menu mode={props.mode}>
				<Menu.Item key="login">
					{location.pathname === '/professor' || location.pathname === '/register/professor' ? (
						<Link to="/login/professor">로그인</Link>
					) : (
						<Link to="/login">로그인</Link>
					)}
				</Menu.Item>
				<Menu.Item key="register">
					{location.pathname === '/' && <Link to="/studentcard">회원가입</Link>}
					{location.pathname === '/professor' && <Link to="/register/professor">회원가입</Link>}
				</Menu.Item>
			</Menu>
		);
	} else {
		return (
			<Menu mode={props.mode}>
				<Menu.Item key="mypage">
					{location.pathname === '/professor' ? (
						<Link to="/professor/mypage">출석부</Link>
					) : (
						<Link to="/mypage">마이페이지</Link>
					)}
				</Menu.Item>
				<Menu.Item key="logout">
					<a onClick={logoutHandler}>로그아웃</a>
				</Menu.Item>
			</Menu>
		);
	}
}

export default withRouter(RightMenu);
