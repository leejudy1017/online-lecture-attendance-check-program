import React from 'react';
import { Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function LandingPage() {
	const user = useSelector((state) => state.user);
	const { Paragraph } = Typography;

	if (user.userData && !user.userData.isAuth) {
		return (
			<>
				<div className="app">
					<div style={{ marginRight: '1rem' }}>
						<img
							src="https://user-images.githubusercontent.com/60956392/99896052-4f49fa00-2cd0-11eb-8208-69b803add0a0.png"
							alt="logo"
							width="400px"
						/>
					</div>
					<br />
					<Typography style={{ fontSize: '1rem' }}>
						<Paragraph>
							기존의 화상 강의 시 출석체크로 불편함을 느꼈다면 출첵을 이용해보세요
						</Paragraph>
						<Paragraph>최초 1회 얼굴 등록으로 간편한 출석체크 기능을 제공합니다.</Paragraph>
					</Typography>
					<br />
					<div style={{ flexDirection: 'row' }}>
						<Button type="primary" style={{ marginRight: '1rem' }}>
							<Link to="/login">로그인</Link>
						</Button>

						<Button type="primary">
							<Link to="/studentcard">회원가입</Link>
						</Button>
					</div>
				</div>
			</>
		);
	} else {
		return (
			<>
				<div className="app">
					<div style={{ marginRight: '3rem' }}>
						<img
							src="https://user-images.githubusercontent.com/60956392/95540043-e3b31280-0a2a-11eb-82a8-58e550fa2e3f.png"
							alt="logo"
							width="300px"
						/>
					</div>
					<br />
					<Typography style={{ fontSize: '1rem' }}>
						<Paragraph>
							기존의 화상 강의 시 출석체크로 불편함을 느꼈다면 출첵을 이용해보세요
						</Paragraph>
						<Paragraph>최초 1회 얼굴 등록으로 간편한 출석체크 기능을 제공합니다.</Paragraph>
					</Typography>
					<br />
					<Button type="primary" value="large" style={{ width: '100px', height: '40px' }}>
						<Link to="/face">얼굴 등록</Link>
					</Button>
				</div>
			</>
		);
	}
}

export default LandingPage;
