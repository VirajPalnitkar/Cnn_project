import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/Capture.css";

export default function Capture() {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const location = useLocation();
  const { mobileNumber } = location.state || {};

  useEffect(() => {
    console.log("Mobile Number passed to Capture:", mobileNumber);
  }, [mobileNumber]);

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    } else {
      alert("Error capturing image. Please try again.");
    }
  };

  const handleCompare = async () => {
    if (!capturedImage) {
      alert("Please capture an image.");
      return;
    }

    if (!mobileNumber) {
      alert("No mobile number provided. Please try again.");
      return;
    }

    const blob = await fetch(capturedImage).then((res) => res.blob());

    const formData = new FormData();
    formData.append("file", blob, "captured-image.jpg");
    formData.append("phoneNumber", mobileNumber);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/compare",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response from backend:", response.data);
      if (response.data.match) {
        alert("Attendence Marked!");
      } else {
        alert("Face not matched!");
      }
    } catch (error) {
      console.error("Error comparing face:", error);
      alert("Error during comparison. Please check the console for details.");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h2 className="text-center">Capture your image</h2>
        </div>
      </div>
      <div className="row">
        <div className="col d-flex justify-content-center">
          <div className="webcam">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={300}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col d-flex justify-content-center">
          <button className="btn btn-primary" onClick={capture}>Capture</button>
        </div>
      </div>
      <div className="row">
        <div className="col">
          {capturedImage && (
            <div className="capture">
              <h3>Captured Image:</h3>
              <img src={capturedImage} alt="Captured" />
              <button className="btn btn-primary" onClick={handleCompare}>Compare with Database</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// import React, { useRef, useState, useEffect } from 'react';
// import Webcam from 'react-webcam';

// export default function Capture(){
//     const webcamRef = useRef(null);
//     const [capturedImage, setCapturedImage] = useState(null);
//     const [model, setModel] = useState(null);

//     const capture = async () => {
//         const imageSrc = webcamRef.current.getScreenshot();
//         setCapturedImage(imageSrc);
//         console.log(webcamRef);
//     };

//     return(<>
//         <div>
//       <h2>Capture your image</h2>
//       <div className="webcam">
//         <Webcam
//           audio={false}
//           ref={webcamRef}
//           screenshotFormat="image/jpeg"
//           width={300}
//         />
//         <button onClick={capture}>Capture</button>
//         {capturedImage && (
//           <div>
//             <h3>Captured Image:</h3>
//             <img src={capturedImage} alt="Captured" />
//           </div>
//         )}
//      </div>
//      </div>
//      </>);
//  }
