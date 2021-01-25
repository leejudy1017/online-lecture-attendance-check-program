import React, { useState, useEffect } from 'react';
import { Typography, Divider, Tabs, Table } from 'antd';
import { useSelector } from 'react-redux';
import Fade from 'react-reveal/Fade';
import axios from 'axios';

const { Title } = Typography;

const { TabPane } = Tabs;

const CheckContetns = () => {
	const user = useSelector((state) => state.user);
	const [Courses, setCourses] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [loading, setLoading] = useState(true);
	const getCheck = () => {
		return new Promise((resolve, reject) => {
			let body = {
				userId: user.userData.studentId,
			};
			axios.post('/api/datas/check', body).then((response) => {
				if (response.data.success) {
					console.log(response.data.checkList);
					async function setToList(checkList) {
						checkList.sort(function (a, b) {
							return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
						});
						let courseList = [];

						for (let c of checkList) {
							courseList.push(c.name);
						}
						courseList = [...new Set(courseList)];
						return courseList;
					}
					async function setToList2(courseList) {
						let _list = [];
						for (let c of courseList) {
							_list.push({ name: c, check: [] });
						}
						return _list;
					}

					async function listObj(_list, checkList) {
						for (let c of _list) {
							for (let s of checkList) {
								if (s.name == c.name) {
									delete s.name;
									delete s.key;
									c.check.push(s);
									console.log(_list);
								}
							}
						}
						return _list;
					}
					async function main(checkList) {
						const _list = await setToList(checkList);
						console.log(_list);
						const _list2 = await setToList2(_list);
						console.log(_list2);

						const list2 = await listObj(_list2, checkList);
						console.log(list2);
						return list2;
					}
					const a = main(response.data.checkList);
					resolve(a);
				} else {
					alert('수업 정보를 가져오는데 실패했습니다.');
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
			}, 2000);

			console.log(loading);
			console.log(Data);
		};

		fetchCheck();
	}, []);

	const columns = [
		{
			title: '주차',
			key: 'week',
			dataIndex: 'week',
		},
		{
			title: '얼굴',
			key: 'face',
			dataIndex: 'face',
		},
		{
			title: '제스쳐',
			key: 'gesture',
			dataIndex: 'gesture',
		},
	];

	if (loading) {
		return (
			<Fade>
				<div className="contents" style={{ width: '100%', overflowX: 'scroll' }}>
					<Title>마이페이지</Title>
					<Title level={5}>출석체크 확인</Title>
					<Divider />
					<Table columns={columns} loading={loading}></Table>
				</div>
			</Fade>
		);
	} else {
		return (
			<Fade>
				<div
					className="contents"
					style={{ width: '100%', overflowX: 'scroll', overflowY: 'scroll' }}
				>
					<Title>마이페이지</Title>
					<Title level={5}>출석체크 확인</Title>
					<Divider />
					<Tabs defaultActiveKey="1" style={{ overflowX: 'scroll' }}>
						{tableData.map((pane) => (
							<TabPane tab={pane.name} key={pane.name}>
								<Table columns={columns} dataSource={pane.check}></Table>
							</TabPane>
						))}
					</Tabs>
				</div>
			</Fade>
		);
	}
};

export default CheckContetns;
