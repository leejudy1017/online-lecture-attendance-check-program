import React from 'react';
import { Button, Typography, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const { Paragraph } = Typography;
function ProfessorLandingPage() {
	const user = useSelector((state) => state.user);
	if (user.userData && !user.userData.isAuth) {
		return (
			<>
				<div className="app">
					<div style={{ marginRight: '1rem' }}>
						<img
							src="https://user-images.githubusercontent.com/60956392/99896054-52dd8100-2cd0-11eb-8fed-622e4bcb97e1.png"
							alt="logo"
							width="400px"
						/>
					</div>
					<br />
					<Typography style={{ fontSize: '1rem' }}>
						<Paragraph>교수님 회원가입 페이지입니다.</Paragraph>
						<Paragraph>교수님의 아이디로 출석프로그램에 로그인 할 수 있습니다.</Paragraph>
					</Typography>
					<br />
					<Row gutter={16}>
						<Col>
							<Button type="primary">
								<Link to="/register/professor">회원가입</Link>
							</Button>
						</Col>
						<Col>
							<Button type="primary">
								<Link to="/login/professor">로그인</Link>
							</Button>
						</Col>
					</Row>
				</div>
			</>
		);
	} else {
		return (
			<>
				<div className="app">
					<div style={{ marginRight: '1rem' }}>
						<img
							src="https://user-images.githubusercontent.com/60956392/99896054-52dd8100-2cd0-11eb-8fed-622e4bcb97e1.png"
							alt="logo"
							width="400px"
						/>
					</div>
					<br />
					<Typography style={{ fontSize: '1rem' }}>
						<Paragraph>교수님 회원가입 페이지입니다.</Paragraph>
						<Paragraph>교수님의 아이디로 출석프로그램에 로그인 할 수 있습니다.</Paragraph>
					</Typography>
					<br />
					<Row gutter={16}>
						<Col>
							<Button type="primary">
								<Link to="/professor/mypage">출석부</Link>
							</Button>
						</Col>
					</Row>
				</div>
			</>
		);
	}
}

export default ProfessorLandingPage;
