import React, {useState} from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../../_actions/user_actions';
import { useDispatch } from 'react-redux';
import { Form, Input, Button } from 'antd';

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


function RegisterPage(props) {
  
  const dispatch = useDispatch();
  console.log(props.location.state.studentid )
  const studentid = props.location.state.studentid 
  const studentcard = props.location.state.filePath
  return (
    <Formik
      initialValues={{
        email: '',
        studentId: studentid,
        name: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required('이름을 입력해주세요'),
        email: Yup.string().email('이메일 형식이 잘못되었습니다').required('이메일을 입력해주세요'),
        password: Yup.string().min(6, '비밀번호는 최소 6자리 이상 입력해주세요').required('비밀번호를 입력해주세요'),
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
            studentId: studentid,
            studentcard: studentcard
          };

          dispatch(registerUser(dataToSubmit)).then((response) => {
            if (response.payload.success) {
              props.history.push('/login');
            } else {
              alert(response.payload.message);
            }
          });

          setSubmitting(false);
        }, 500);
      }}
    >
      {(props) => {
        const { values, touched, errors, dirty, isSubmitting, handleChange, handleBlur, handleSubmit, handleReset } = props;
        return (
          <div className="contents">
            <h1>회원가입</h1>
            <br />
            <Form style={{ minWidth: '375px' }} {...formItemLayout} onSubmit={handleSubmit}>
              <Form.Item required label="이름">
                <Input id="name" placeholder="이름" type="text" value={values.name} onChange={handleChange} onBlur={handleBlur} className={errors.name && touched.name ? 'text-input error' : 'text-input'} />
                {errors.name && touched.name && <div className="input-feedback">{errors.name}</div>}
              </Form.Item>
              <Form.Item required label="학번">
                <Input id="studentId" disabled type="text" value={studentid} onChange={handleChange} onBlur={handleBlur} />
                
              </Form.Item>

              <Form.Item required label="Email" hasFeedback>
                <Input id="email" placeholder="Email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} className={errors.email && touched.email ? 'text-input error' : 'text-input'} />
                {errors.email && touched.email && <div className="input-feedback">{errors.email}</div>}
              </Form.Item>

              <Form.Item required label="비밀번호" hasFeedback>
                <Input id="password" placeholder="비밀번호" type="password" value={values.password} onChange={handleChange} onBlur={handleBlur} className={errors.password && touched.password ? 'text-input error' : 'text-input'} />
                {errors.password && touched.password && <div className="input-feedback">{errors.password}</div>}
              </Form.Item>

              <Form.Item required label="비밀번호 확인" hasFeedback>
                <Input id="confirmPassword" placeholder="비밀번호 확인" type="password" value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} className={errors.confirmPassword && touched.confirmPassword ? 'text-input error' : 'text-input'} />
                {errors.confirmPassword && touched.confirmPassword && <div className="input-feedback">{errors.confirmPassword}</div>}
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

export default RegisterPage;
