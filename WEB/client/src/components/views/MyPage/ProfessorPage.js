import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Divider, Tabs, Table } from 'antd';
import { useSelector } from 'react-redux';
import Fade from 'react-reveal/Fade';
import axios from 'axios';
import { USER_SERVER } from '../../Config';

const { Title } = Typography;

const { TabPane } = Tabs;
const { Header, Content } = Layout;

const CheckContetns = () => {
	const user = useSelector((state) => state.user);
	const [TableData, setTableData] = useState([]);
	const [loading, setLoading] = useState(true);
	const getCheck = () => {
		return new Promise((resolve, reject) => {
			let body = {
				name: user.userData.name,
				major: user.userData.major,
			};
			axios.post('/api/datas/check/professor', body).then((response) => {
				if (response.data.success) {
					const Courses = response.data.checkList;
					async function findcourses(Courses) {
						let Check = [];
						let DataSet = [];
						let name = '';
						let key = '';
						Courses.forEach((course) => {
							course.forEach((element) => {
								Check.push({
									id: element.studentid,
									face: element.face,
									gesture: element.gesture,
									week: element.week,
								});
								name = element.name;
								key = element.key;
							});
							if (course !== []) {
								DataSet.push({ key: key, name: name, check: Check });
								Check = [];
								name = '';
							}
						});
						return DataSet;
					}
					async function main(Courses) {
						const a = await findcourses(Courses);
						return a;
					}
					const result = main(Courses);
					resolve(result);
				} else {
					alert('정보를 가져오는데 실패했습니다.');
				}
			});
		});
	};
	useEffect(() => {
		const fetchCheck = async () => {
			const Data = await getCheck();
			console.log(Data);
			setTimeout(() => {
				setTableData(Data);
				setLoading(false);
			}, 5000);
		};

		fetchCheck();
	}, []);

	const columns = [
		{
			title: '주차',
			key: 'week',
			dataIndex: 'week',
			defaultSortOrder: 'descend',
			sorter: (a, b) => a.week - b.week,
		},
		{
			title: '학번',
			key: 'id',
			dataIndex: 'id',
		},
		{
			title: '얼굴인증',
			key: 'face',
			dataIndex: 'face',
		},
		{
			title: '제스쳐인증',
			key: 'gesture',
			dataIndex: 'gesture',
		},
	];

	const logoutProfHandler = (props) => {
		axios.get(`${USER_SERVER}/logout`).then((response) => {
			if (response.status === 200) {
				console.log('로그아웃');
			} else {
				alert('로그아웃 실패');
			}
		});
	};

	return (
		<div>
			<Layout className="layout">
				<Header>
					<Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
						<Menu.Item key="1">
							<a href="/professor">홈</a>
						</Menu.Item>
						<Menu.Item key="2">출석부</Menu.Item>
						<Menu.Item key="3">
							<a onClick={logoutProfHandler} href="/professor">
								로그아웃
							</a>
						</Menu.Item>
					</Menu>
				</Header>
				<Content style={{ overflowY: 'auto' }}>
					{loading && (
						<Fade>
							<div className="contents">
								<Title>출석부</Title>
								<Divider />
								<Table columns={columns} loading={loading}></Table>
							</div>
						</Fade>
					)}
					{!loading && (
						<Fade>
							<div className="contents">
								<Title>출석부</Title>
								<Divider />

								<Tabs defaultActiveKey="1">
									{TableData.map((pane) => (
										<TabPane tab={pane.name} key={pane.key}>
											<Table
												bordered
												columns={columns}
												size="small"
												dataSource={pane.check}
											></Table>
										</TabPane>
									))}
								</Tabs>
							</div>
						</Fade>
					)}
				</Content>
			</Layout>
		</div>
	);
};

export default CheckContetns;
