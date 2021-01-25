import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../../_actions/user_actions';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Select } from 'antd';
import ProfessorUpload from '../../../utils/ProfeesorUpload';

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 8 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 16 },
	},
};
const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0,
		},
		sm: {
			span: 16,
			offset: 8,
		},
	},
};

const category = ['교양', '유아교육과', '영어영문학과', '독일어문학전공', '프랑스어문학전공', '아시아문화학부', '일본어문학전공', '중국어문학전공', '철학과', '공공인재학부', '심리학과', '문헌정보학과', '사회복지학부', '도시계획·부동산 학과', '디지털미디어콘텐츠전공', '영어교육과', '화학과', '물리학과', '국어국문학과', '유럽문화학부', '러시아어문학전공', '역사학과', '정치국제학과', '언론정보전공', '체육교육과', '융합교양학부', '교육학과', '사회학과', '미디어커뮤니케이션학부', '수학과', '생명과학과', '도시시스템공학전공', '건축공학전공', '건축학전공', '화학신소재공학부', '건설환경플랜트공학전공', '기계공학부', '사회기반시스템공학부', '발전전기전공', '발전기계전공', '원자력전공', '전자전기공학부', '융합공학부', '나노바이오소재공학전공', '디지털이미징전공', '소프트웨어학부', '에너지시스템 공학부', '바이오메디컬공학전공', '경영학전공', '경제학부(서울)', '글로벌금융전공', '광고홍보학과', '지식경영학부', '국제물류 학과', '산업보안학과', '응용통계학과', '약학부', '제약학전공', '간호학과', '공간연출전공', '연극전공', '의학부', '식품영양전공', '문화콘텐츠융합전공', '게임·인터렉티브미디어융합전공', '금융공학융합전공', '영화전공', '사이버보안융합전공', '약학전공', '패션디자인전공', '문화다양성 융합전공', '국제학과', '창업학융합전공', '소프트웨어·인문융합전공', '실내환경디자인전공', '공연영상창작학부', '테크놀로지아트융합전공']
const { Option } = Select;
function RegisterProfessor(props) {
	const [path, setPath] = useState('');
	const dispatch = useDispatch();
	const [major, setMajor] = useState('')
	const updatePathHandler = (data) => {
		setPath(data);
		console.log(path);
	};
	
	const majorHandler = (major) =>{
		setMajor(major);
	}


	return (
		<Formik
			initialValues={{
				email: '',
				name: '',
				password: '',
				confirmPassword: '',
			}}
			validationSchema={Yup.object().shape({
				name: Yup.string().required('이름을 입력해주세요'),
				email: Yup.string().email('이메일 형식이 잘못되었습니다').required('이메일을 입력해주세요'),
				password: Yup.string()
					.min(6, '비밀번호는 최소 6자리 이상 입력해주세요')
					.required('비밀번호를 입력해주세요'),
				confirmPassword: Yup.string()
					.oneOf([Yup.ref('password'), null], '비밀번호를 똑같이 입력해주세요')
					.required('비밀번호를 입력해주세요'),
			})}
			onSubmit={(values, { setSubmitting }) => {
				setTimeout(() => {
					let dataToSubmit = {
						email: values.email,
						password: values.password,
						name: values.name,
						role: 1,
						profcard: path,
						major: major
					};

					dispatch(registerUser(dataToSubmit)).then((response) => {
						if (response.payload.success) {
							props.history.push('/professor');
						} else {
							alert('err');
							console.log(response.payload.err);
						}
					});

					setSubmitting(false);
				}, 500);
			}}
		>
			{(props) => {
				const {
					values,
					touched,
					errors,
					dirty,
					isSubmitting,
					handleChange,
					handleBlur,
					handleSubmit,
					handleReset,
				} = props;

				return (
					<div className="app">
						<h1>회원가입</h1>
						<br />
						<Form style={{ minWidth: '375px' }} {...formItemLayout} onSubmit={handleSubmit}>
							<Form.Item required label="학과">
							<Select
							placeholder="학과"
							onChange={majorHandler}
							allowClear
							>
							{category.map((major) => <Option value={major}r>{major}</Option>)}
							</Select>
							
							</Form.Item>
							<Form.Item required label="이름">
								<Input
									id="name"
									placeholder="이름"
									type="text"
									value={values.name}
									onChange={handleChange}
									onBlur={handleBlur}
									className={errors.name && touched.name ? 'text-input error' : 'text-input'}
								/>
								{errors.name && touched.name && <div className="input-feedback">{errors.name}</div>}
							</Form.Item>
							<Form.Item required label="Email" hasFeedback>
								<Input
									id="email"
									placeholder="Email"
									type="email"
									value={values.email}
									onChange={handleChange}
									onBlur={handleBlur}
									className={errors.email && touched.email ? 'text-input error' : 'text-input'}
								/>
								{errors.email && touched.email && (
									<div className="input-feedback">{errors.email}</div>
								)}
							</Form.Item>

							<Form.Item required label="비밀번호" hasFeedback>
								<Input
									id="password"
									placeholder="비밀번호"
									type="password"
									value={values.password}
									onChange={handleChange}
									onBlur={handleBlur}
									className={
										errors.password && touched.password ? 'text-input error' : 'text-input'
									}
								/>
								{errors.password && touched.password && (
									<div className="input-feedback">{errors.password}</div>
								)}
							</Form.Item>

							<Form.Item required label="비밀번호 확인" hasFeedback>
								<Input
									id="confirmPassword"
									placeholder="비밀번호 확인"
									type="password"
									value={values.confirmPassword}
									onChange={handleChange}
									onBlur={handleBlur}
									className={
										errors.confirmPassword && touched.confirmPassword
											? 'text-input error'
											: 'text-input'
									}
								/>
								{errors.confirmPassword && touched.confirmPassword && (
									<div className="input-feedback">{errors.confirmPassword}</div>
								)}
							</Form.Item>
							<Form.Item required label="신분증(교수증) 사진">
								<ProfessorUpload updatePathHandler={updatePathHandler} />
							</Form.Item>

							<Form.Item {...tailFormItemLayout}>
								<Button onClick={handleSubmit} type="primary" disabled={isSubmitting}>
									회원가입
								</Button>
							</Form.Item>
						</Form>
					</div>
				);
			}}
		</Formik>
	);
}

export default RegisterProfessor;
