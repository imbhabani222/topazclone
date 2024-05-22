
import { Modal, Button } from "antd";
import React, { Component, useState } from "react";

import Webcam from "react-webcam";

const ImageCapturing = ({ setImage, visiable, setVisiable, image }) => {
  const videoConstraints = {
    width: 220,
    height: 200,
    facingMode: "user",
  };


  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  });
  return (
    <>
      <Modal
        title="Basic Modal"
        centered
        visible={false}
        maskClosable={false}
        onCancel={() => setVisiable()}
      >
        <div className="webcam-container">
          {image == "" ? (
            <Webcam
              audio={false}
              height={200}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={220}
              videoConstraints={videoConstraints}
            />
          ) : (
            <img src={image} />
          )}
          <Button
            onClick={(e) => {
              e.preventDefault();
              capture();
            }}
          >
            Capture
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ImageCapturing;
