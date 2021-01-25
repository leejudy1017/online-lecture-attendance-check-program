import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { BookOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import Fade from 'react-reveal/Fade';
import { useSelector } from 'react-redux';

import './Mypage.css';
import VideoContents from './Section/VideoContents';
import CheckContetns from './Section/CheckContents';
import CourseContents from './Section/CourseContents';

const { Content, Sider } = Layout;

const MyPage = () => {
	const user = useSelector((state) => state.user);

	const [visiblevideo, setVisiblevideo] = useState(true);
	const [visiblecheck, setVisiblecheck] = useState(false);
	const [visiblecourse, setVisiblecourse] = useState(false);

	const videoHandler = () => {
		setVisiblecourse(false);
		setVisiblecheck(false);
		setVisiblevideo(true);
	};
	const checkHandler = () => {
		setVisiblecourse(false);
		setVisiblevideo(false);
		setVisiblecheck(true);
	};
	const courseHandler = () => {
		setVisiblevideo(false);
		setVisiblecheck(false);
		setVisiblecourse(true);
	};
	return (
		<Fade>
			<Layout>
				<Sider
					className="site-layout-background"
					breakpoint="xs"
					collapsedWidth="0"
					onBreakpoint={(broken) => {
						console.log(broken);
					}}
					onCollapse={(collapsed, type) => {
						console.log(collapsed, type);
					}}
				>
					<div className="logo">
						<Menu
							mode="inline"
							defaultSelectedKeys={['1']}
							style={{ height: '100%', borderRight: 0 }}
						>
							<Menu.Item key="1" icon={<VideoCameraOutlined />}>
								<a onClick={videoHandler}>등록영상 확인</a>
							</Menu.Item>
							<Menu.Item key="2" icon={<UserOutlined />}>
								<a onClick={checkHandler}>출석체크 확인</a>
							</Menu.Item>
							<Menu.Item key="3" icon={<BookOutlined />}>
								<a onClick={courseHandler}>등록수업 수정</a>
							</Menu.Item>
						</Menu>
					</div>
				</Sider>
				<Content style={{ overflowY: 'scroll' }}>
					{visiblevideo && <VideoContents user={user} />}
					{visiblecheck && <CheckContetns />}
					{visiblecourse && <CourseContents />}
				</Content>
			</Layout>
		</Fade>
	);
};

export default MyPage;
