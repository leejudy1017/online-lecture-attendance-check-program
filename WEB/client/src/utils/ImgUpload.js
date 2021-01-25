import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { LoadingOutlined } from '@ant-design/icons';
import { Typography, Divider } from 'antd';
import axios from 'axios';

const { Paragraph, Text } = Typography;

const ImgUpload = (props) => {
	const [Image, setImage] = useState('');
	const onDrop = useCallback(
		(files) => {
			let formData = new FormData();
			const config = {
				header: { 'content-type': 'multipart/form-data' },
			};
			formData.append('file', files[0]);
			props.loadingFunction(true);
			axios.post('/api/datas/studentcard', formData, config).then((response) => {
				if (response.data.success) {
					setImage(response.data.filePath);
					props.refreshFunction(response);
					props.loadingFunction(false);
					props.ableFunction(false);
				} else {
					props.loadingFunction(false);
					props.ableFunction(true);
					alert('사진에서 학번을 못찾았습니다.');
				}
			});
		},
		[Image]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
	});
	return (
		<div>
			<section className="container">
				<div
					style={{
						width: 200,
						height: 160,
						border: '1px solid lightgray',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
					{...getRootProps({ className: 'dropzone' })}
				>
					<input {...getInputProps()} />
					{isDragActive ? (
						<LoadingOutlined style={{ fontSize: '3rem' }} />
					) : (
						<Paragraph style={{ fontSize: '1rem', textAlign: 'center' }}>
							사진을 <Text type="danger">드래그</Text>하거나,
							<br />
							박스를 <Text type="danger">클릭</Text>해주세요{' '}
						</Paragraph>
					)}
				</div>
				<Divider />
			</section>
		</div>
	);
};

export default ImgUpload;
