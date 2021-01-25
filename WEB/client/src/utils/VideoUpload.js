import React, { useState, useRef, useCallback,useEffect } from 'react';
import Webcam from 'react-webcam';
import { Progress, Button, Typography } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Fade from 'react-reveal/Fade';


const { Title, Paragraph, Text } = Typography;

const VideoUpload = (props) => {
  const user = useSelector((state) => state.user);
  const [webcamExists, setWebcamExists] = useState(true)
  const [percent, setPercent] = useState(0);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [video, setVideo] = useState('');
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    setWebcamExists(true)
  }, [])
  
  const CloseWebcamHandler = () =>{
    setWebcamExists(false)
  }
  

  const StartCaptureClickHandler = () => {
    setWebcamExists(true)
    setCapturing(true);
    setRecordedChunks([]);
    setImgSrc(null);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/webm',
    });
    mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
    mediaRecorderRef.current.start();

    let percentage = percent;
    const timer = setInterval(() => {
      percentage = percentage + 1;
      setPercent(percentage);
      if (percentage >= 100) {
        setCapturing(false);
        mediaRecorderRef.current.stop();
        setPercent(0);
        clearInterval(timer);
      }
    }, 100);
  };

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks([data]);
        MakeBlob([data]);
      }
    },
    [setRecordedChunks]
  );


  const MakeBlob = (file) => {
    const blob = new Blob(file, {
      type: "video/webm"
    });
    const url = URL.createObjectURL(blob);
    setImgSrc(url);
  }

  const SaveHandler = (file) => {
    const blob = new Blob(file, {
      type: "video/webm"
    });
    let formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' },
    };
    formData.append('studentid', user.userData.studentId);
    formData.append('file', blob);
    axios.post('/api/datas/uploadfile', formData, config).then((response) => {
      if (response.data.success) {
        setVideo(response.data.filePath);
        props.saveVideoHandler(response.data.filePath);
        props.updateStartHandler();
        CloseWebcamHandler()
      } else {
        console.log(response)
      }
    });

  };

  return (
    <>
      <Title>영상 등록</Title>
      <div style={{ display: 'flex' , justifyContent:'center', alignItems: 'center',  border: '1px solid lightgray', borderStyle: 'dashed', height: '300px', padding: '1rem 1rem'}}>
         <Fade>
        {webcamExists && <Webcam
          audio={false}
          ref={webcamRef}
          height={230}
          width={306}
          screenshotFormat="video/webm"
        />}
        </Fade>
          {imgSrc && (
            <Fade>
            <div style={{marginLeft: '1rem'}}>
            <video controls height="230" autoPlay>
              <source src={imgSrc} type="video/webm" />
            </video>
            </div>
            </Fade>
          )}
          
      </div>
      <br />
      
      <div style={{ display: 'flex' }}>
        {capturing ? (
          <p> 녹화중 📹 </p>
        ) : (
            <Button onClick={StartCaptureClickHandler}>영상 녹화</Button>
          )}
        <div style={{ marginLeft: '1rem' }}>
          {imgSrc && (
            <Button onClick={() => SaveHandler(recordedChunks)}>영상 저장</Button>
          )}
        </div>
      </div>
      <br />
      {!imgSrc && (
        <div style={{ width: '300px' }}>
          <Progress percent={percent} showInfo={false} strokeWidth={13} />
        </div>
      )}
      
      {imgSrc && (<Fade>
        <Paragraph>다시 녹화하고 싶으면 <Text code>영상녹화</Text>를 눌러주시고, 해당 영상으로 등록하시려면 <Text code>영상저장</Text>을 눌러주세요.</Paragraph>
        </Fade>
      )}
     
    </>
  );
};

export default VideoUpload;
