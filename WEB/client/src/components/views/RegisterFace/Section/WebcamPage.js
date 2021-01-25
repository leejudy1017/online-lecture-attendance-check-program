import React, { useState, useRef, useCallback } from 'react';
import { Button, Result, Typography } from 'antd';
import VideoUpload from '../../../../utils/VideoUpload.js';
import {Link} from 'react-router-dom'
import Fade from 'react-reveal/Fade'
const WebcamPage = (props) => {
  
  const [start, setStart] = useState(true);
  const [video, setVideo] = useState('');


  const updateStartHandler = () => {
    setStart(false);
  };

  const saveVideoHandler = (faceVideo) => {
    setVideo(faceVideo);
  };


  if (start) {
    return (
      <Fade>
      <div className="contents">
      <VideoUpload updateStartHandler={updateStartHandler} saveVideoHandler={saveVideoHandler} />
      </div>
      </Fade>
    );
  } else {
    return (
      <>
      <Fade bottom>
        <Result
          status="success"
          title="얼굴 등록이 완료되었습니다!"
          subTitle="다음으로 수강중인 수업을 등록해주세요."
          extra={[
            <Button type="primary" key="save">
              <Link to="/course">수업 등록</Link>
            </Button>,
          ]}
        />
        </Fade>
      </>
    );
  }
};

export default WebcamPage;
