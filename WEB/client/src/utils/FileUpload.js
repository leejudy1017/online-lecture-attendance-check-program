import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import {Typography} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';


const {Title, Paragraph, Text} = Typography;
const FileUpload = (props) => {
  const user = useSelector((state) => state.user);
  const [Video, setVideo] = useState('');
  const onDrop = useCallback(
    (files) => {
      let formData = new FormData();
      const config = {
        header: { "content-type": "multipart/form-data" },
      };
      formData.append('studentid', user.userData.studentId);
      formData.append("file", files[0]);

    axios.post('/api/datas/uploadfile', formData, config).then((response) => {
      if (response.data.success) {
        setVideo(response.data.filePath);
        props.saveVideoHandler(response.data.filePath);
        props.updateStartHandler();
      } else {
        alert('파일을 저장하는데 실패했습니다.');
      }
    });
    },
    [Video]
  );


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'video/*'
  });


  return (
    <div >
    
      <Title>영상 등록</Title>
      <br/>
      <section className="container">
        <div
          style={{
            width: 300,
            height: 240,
            border: "1px solid lightgray",
            borderStyle: 'dashed',
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          {...getRootProps({ className: "dropzone" })}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <LoadingOutlined  style={{ fontSize: "3rem" }} />
          ) : (
            <Paragraph style={{ fontSize: "1rem", textAlign:'center' }}> 업로드 할 동영상을 <Text type="danger">드래그</Text>하거나,
            <br/>박스를  <Text type="danger">클릭</Text>해주세요 </Paragraph> 
          )}
        </div>
      </section>
    </div>
    
  );
};

export default FileUpload;
