// import React, { useRef, useState } from 'react';
// import Webcam from 'react-webcam';
// import axios from 'axios';

// export default function Capture() {
//   const webcamRef = useRef(null);
//   const [capturedImage, setCapturedImage] = useState(null);

//   const capture = async () => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     setCapturedImage(imageSrc);
    
//     // Convert the base64 image to a Blob (file format)
//     const blob = await fetch(imageSrc).then((res) => res.blob());

//     // Create a FormData object to send the file
//     const formData = new FormData();
//     formData.append('file', blob, 'captured-image.jpg');

//     // Send the image to the backend
//     try {
//       const response = await axios.post('http://localhost:5000/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       console.log('Response from backend:', response.data);
//     } catch (error) {
//       console.error('Error uploading image:', error);
//     }
//   };

//   return (
//     <div>
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
//       </div>
//     </div>
//   );
// }




import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';

export default function Capture(){
    const webcamRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [model, setModel] = useState(null);

    const capture = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        console.log(webcamRef);
    };

    return(<>
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
          </div>
        )}
     </div>
     </div>
     </>);
 }