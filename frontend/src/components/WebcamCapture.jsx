import React, { useState, useCallback } from 'react';
import Webcam from 'react-webcam';

const WebcamCapture = ({ onCapture }) => {
  const [image, setImage] = useState(null);
  const webcamRef = React.useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    onCapture(imageSrc);  // Pass captured image to parent component
  }, [webcamRef, onCapture]);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
      />
      <button onClick={capture}>Capture Photo</button>
      {image && <img src={image} alt="Captured" />}
    </div>
  );
};

export default WebcamCapture;
