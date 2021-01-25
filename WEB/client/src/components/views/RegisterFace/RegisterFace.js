import React from 'react';
import { Button, Typography , Divider } from 'antd';
import {Link} from 'react-router-dom'
import Fade from 'react-reveal/Fade'


const { Title, Paragraph , Text} = Typography;

const RegisterFace = (props) => {

    return (
      <Fade>
      <div className='contents' >
        
        <Title>영상 녹화 방법</Title>
        <div>
        <Divider/>
        <div style={{marginLeft : '4rem', height:'220px'}}>
        <img src="https://user-images.githubusercontent.com/60956392/97309980-0dcb5800-18a6-11eb-8968-c74ef71ae421.gif" width="240" alt="guide"/>
        </div>
        <Divider/>
        <Paragraph> 위와 같이 최대한 <Text code>상, 하, 좌, 우</Text> 다양한 각도로 얼굴을 찍어주세요. </Paragraph>
        <Paragraph> 웹캠으로 녹화 시 <Text strong>10초</Text> 녹화가 진행됩니다. </Paragraph>
        <Paragraph> 파일로 동영상을 업로드 시에는 <Text strong>10초 이상</Text>의 동영상을 업로드해야 합니다. </Paragraph>
        <Divider/>
        </div>
        
        <div style={{display:'flex', justifyContent: 'space-evenly'}}>
          <Button style={{marginRight:'2rem'}}><Link to='/face/webcam'>웹캠으로 녹화하기</Link></Button>
          <Button><Link to='/face/upload'>파일 업로드하기</Link></Button>
        </div>

      </div>
      </Fade>
      
    );
  
};

export default RegisterFace;
