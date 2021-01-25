import React, { useState } from 'react';
import RightMenu from './Sections/RightMenu';
import { Drawer, Button } from 'antd';
import { AlignRightOutlined } from '@ant-design/icons';
import './Sections/Navbar.css';
import { useSelector } from 'react-redux';
import RightMenuProf from './Sections/RightMenuProf';
import { useLocation } from 'react-router-dom';

function NavBar() {
	const user = useSelector((state) => state.user);
	const location = useLocation();
	console.log(location.pathname);

	const [visible, setVisible] = useState(false);

	const showDrawer = () => {
		setVisible(true);
	};

	const onClose = () => {
		setVisible(false);
	};
	if (user.userData) {
		return (
			<nav className="menu" style={{ position: 'fixed', zIndex: 5, width: '100%' }}>
				<div className="menu__logo">
					{location.pathname === '/professor' ? (
						<a href="/professor">
							<img
								src="https://user-images.githubusercontent.com/60956392/95540373-9be0bb00-0a2b-11eb-8a64-b237b0b8a9c1.png"
								alt="small-log"
								height="35px"
							/>
						</a>
					) : (
						<a href="/">
							<img
								src="https://user-images.githubusercontent.com/60956392/95540373-9be0bb00-0a2b-11eb-8a64-b237b0b8a9c1.png"
								alt="small-log"
								height="35px"
							/>
						</a>
					)}
				</div>
				<div className="menu__container">
					<div className="menu_rigth">
						<RightMenu mode="horizontal" />
					</div>
					<Button className="menu__mobile-button" type="primary" onClick={showDrawer}>
						<AlignRightOutlined />
					</Button>
					<Drawer
						title="메뉴"
						placement="right"
						className="menu_drawer"
						closable={false}
						onClose={onClose}
						visible={visible}
					>
						<RightMenu mode="inline" />
					</Drawer>
				</div>
			</nav>
		);
	} else {
		return (
			<nav className="menu" style={{ position: 'fixed', zIndex: 5, width: '100%' }}>
				<div className="menu__logo">
					{location.pathname === '/professor' ? (
						<a href="/professor">
							<img
								src="https://user-images.githubusercontent.com/60956392/95540373-9be0bb00-0a2b-11eb-8a64-b237b0b8a9c1.png"
								alt="small-log"
								height="35px"
							/>
						</a>
					) : (
						<a href="/">
							<img
								src="https://user-images.githubusercontent.com/60956392/95540373-9be0bb00-0a2b-11eb-8a64-b237b0b8a9c1.png"
								alt="small-log"
								height="35px"
							/>
						</a>
					)}
				</div>
				<div className="menu__container">
					<div className="menu_rigth">
						<RightMenu mode="horizontal" />
					</div>
					<Button className="menu__mobile-button" type="primary" onClick={showDrawer}>
						<AlignRightOutlined />
					</Button>
					<Drawer
						title="메뉴"
						placement="right"
						className="menu_drawer"
						closable={false}
						onClose={onClose}
						visible={visible}
					>
						<RightMenuProf mode="inline" />
					</Drawer>
				</div>
			</nav>
		);
	}
}

export default NavBar;
