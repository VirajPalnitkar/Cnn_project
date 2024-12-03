import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const Yolo_count = () => {
  const webcamRef = useRef(null);
  const [count, setCount] = useState(0);
  const [detections, setDetections] = useState([]); // State for bounding boxes
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 400, originalWidth: 640, originalHeight: 480 }); // Default dimensions

  // Function to render bounding boxes
  const renderDetections = () => {
    return detections.map((detection, index) => {
      const [x1, y1, x2, y2] = detection; // Bounding box coordinates
      const scaledX1 = (x1 / videoDimensions.originalWidth) * videoDimensions.width;
      const scaledY1 = (y1 / videoDimensions.originalHeight) * videoDimensions.height;
      const scaledWidth = ((x2 - x1) / videoDimensions.originalWidth) * videoDimensions.width;
      const scaledHeight = ((y2 - y1) / videoDimensions.originalHeight) * videoDimensions.height;

      return (
        <div
          key={index}
          style={{
            position: "absolute",
            border: "2px solid green",
            left: `${scaledX1}px`,
            top: `${scaledY1}px`,
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
          }}
        ></div>
      );
    });
  };

  // Capture frame and send it to the backend
  const captureFrame = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then((res) => res.blob());
    const formData = new FormData();
    formData.append("image", blob);

    try {
      const response = await axios.post(
        "http://localhost:5000/detect",
        formData
      );
      setCount(response.data.count); // Update count
      setDetections(response.data.detections); // Update detections
    } catch (error) {
      console.error("Error in detection:", error);
    }
  };

  // Set video dimensions on load
  const handleVideoLoaded = () => {
    const videoElement = webcamRef.current.video;
    const aspectRatio = videoElement.videoWidth / videoElement.videoHeight;

    setVideoDimensions({
      width: 400 * aspectRatio, // Calculate width based on the fixed height of 400px
      height: 400,
      originalWidth: videoElement.videoWidth,
      originalHeight: videoElement.videoHeight,
    });
  };

  return (
    <div className="bg-light" style={{ position: "relative", width: "100%", height: "100vh" }}>
      <h1 className="text-center">Head Count: {count}</h1>
      <div className="container">
        <div className="row">
            <div className="col offset-2">
            <div style={{ position: "relative", height: "400px", width: "100%" }}>
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          onLoadedData={handleVideoLoaded} // Ensure dimensions are set
          style={{
            position: "absolute",
            width: `${videoDimensions.width}px`,
            height: "400px",
          }}
        />
        {renderDetections()} {/* Render bounding boxes */}
      </div>
            </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col d-flex justify-content-center">
            <button
              className="btn btn-primary"
              onClick={captureFrame}
              style={{ marginTop: "10px" }}
            >
              Capture Frame
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Yolo_count;
