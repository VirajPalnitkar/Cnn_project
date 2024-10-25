import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useLocation } from 'react-router-dom';  // Import useLocation to access the mobile number
import axios from 'axios';  // Import axios to send requests

export default function Capture() {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const location = useLocation();  // Get the state passed from Mark component
  const { mobileNumber } = location.state || {};  // Retrieve the mobile number

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
        alert('Please capture an image.');
        return;
    }
    
    if (!mobileNumber) {
        alert('No mobile number provided. Please try again.');
        return;
    }

    // Convert the base64 image to a blob
    const blob = await fetch(capturedImage).then(res => res.blob());

    // Create FormData to send the image and mobile number to the backend
    const formData = new FormData();
    formData.append('file', blob, 'captured-image.jpg');
    formData.append('phoneNumber', mobileNumber);  // Append mobile number for comparison

    try {
        const response = await axios.post('http://127.0.0.1:5000/compare', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Response from backend:', response.data);
        if (response.data.match) {
            alert('Face matched!');
        } else {
            alert('Face not matched!');
        }
    } catch (error) {
        console.error('Error comparing face:', error);
        alert('Error during comparison. Please check the console for details.');
    }
};


  return (
    <div>
      <h2>Capture your image</h2>
      <div className="webcam">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={300}
        />
        <button onClick={capture}>Capture</button>
        {capturedImage && (
          <div>
            <h3>Captured Image:</h3>
            <img src={capturedImage} alt="Captured" />
            <button onClick={handleCompare}>Compare with Database</button>
          </div>
        )}
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