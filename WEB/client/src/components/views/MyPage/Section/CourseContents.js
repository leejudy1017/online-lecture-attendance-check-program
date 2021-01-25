import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Table, Button, Input } from 'antd';
import { useSelector } from 'react-redux';
import Fade from 'react-reveal/Fade';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

const CourseContents = () => {
	const user = useSelector((state) => state.user);
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const [buttondisabled, setButtondisabled] = useState(false);
	const [checkKeys, setCheckKeys] = useState([]);
	const [Selected, setSelected] = useState([]);
	const getCourses = () => {
		setLoading(true);
		axios.get('/api/datas/course').then((response) => {
			if (response.data.success) {
				setCourses([...response.data.courseInfo]);
				console.log(response.data.courseInfo);
				setLoading(false);
				console.log(Selected);
			} else {
				alert('수업 정보를 가져오는데 실패했습니다.');
			}
		});
	};

	const submitHandler = () => {
		let body = {
			userId: user.userData.studentId,
			courses: checkKeys,
		};
		axios.post('/api/datas/update/idincourse', body).then((response) => {
			if (response.data.success) {
				console.log(response.data.success);
			} else {
				alert('ERROR!!');
			}
		});
	};

	useEffect(() => {
		getCourses();
	}, []);

	// rowSelection object indicates the need for row selection

	const getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					placeholder={'검색어를 입력해주세요'}
					value={selectedKeys[0]}
					onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Button
					type="primary"
					onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
					icon={<SearchOutlined />}
					size="small"
					style={{ width: 90 }}
				>
					검색
				</Button>
				<Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
					초기화
				</Button>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex]
				? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
				: '',
	});

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};
	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText('');
	};

	const columns = [
		{
			title: '캠퍼스',
			dataIndex: 'campus',
			key: 'campus',
			width: '10%',
			...getColumnSearchProps('campus'),
		},
		{
			title: '전공',
			dataIndex: 'major',
			key: 'major',
			width: '20%',
			...getColumnSearchProps('major'),
		},
		{
			title: '학년',
			dataIndex: 'year',
			key: 'year',
			width: '10%',
			...getColumnSearchProps('year'),
		},
		{
			title: '수업',
			dataIndex: 'course',
			key: 'course',
			width: '30%',
			...getColumnSearchProps('course'),
		},
		{
			title: '분반',
			dataIndex: 'class',
			key: 'class',
			width: '10%',
			...getColumnSearchProps('class'),
		},

		{
			title: '담당교수',
			dataIndex: 'prof',
			key: 'prof',
			width: '10%',
			...getColumnSearchProps('prof'),
		},
	];

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			setCheckKeys(selectedRows);
			if (selectedRowKeys.length > 0) {
				setButtondisabled(true);
			} else {
				setButtondisabled(false);
			}
			console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
			console.log(checkKeys);
		},
	};

	return (
		<Fade>
			<div className="contents">
				<Title level={5}>수업 확인</Title>
				<Row justify="center">
					<Col>
						<div>
							<div style={{ width: '80%', margin: '0 auto', marginTop: '2rem' }}>
								<Table
									rowSelection={rowSelection}
									columns={columns}
									dataSource={courses}
									// bordered={true}
									loading={loading}
									scroll={{ y: 450 }}
								/>
								<div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '1rem' }}>
									<Button
										type="primary"
										onClick={submitHandler}
										disabled={!buttondisabled}
										loading={loading}
									>
										<Link to="/">등록하기</Link>
									</Button>
								</div>
							</div>
						</div>
					</Col>
				</Row>
			</div>
		</Fade>
	);
};

export default CourseContents;
