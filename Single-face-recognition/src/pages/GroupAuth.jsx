import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const GroupAuth = () => {
  const [matches, setMatches] = useState([]);
  const webcamRef = useRef(null);

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    // Convert base64 image string to Blob
    const blob = await fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => new File([blob], "capture.jpg", { type: "image/jpeg" }));

    return blob;
  };

  const handleUpload = async () => {
    const imageFile = await capture();

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await axios.post('http://localhost:5000/process_group_image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMatches(response.data.matches);
      console.log(response.data.distances);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to process image.');
    }
  };

  return (
    <div>
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
      <button onClick={handleUpload}>Capture & Upload for Authentication</button>

      <div>
        {matches.length > 0 && matches.map((userMatches, idx) => (
          <div key={idx}>
            <h4>Face {idx + 1}</h4>
            {userMatches.length ? (
              <ul>
                {userMatches.map((user, userIdx) => (
                  <li key={userIdx}>{user}</li>
                ))}
              </ul>
            ) : (
              <p>No match found</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupAuth;


// import React, { useState, useRef } from 'react';
// import Webcam from 'react-webcam';
// import axios from 'axios';

// const GroupAuth = () => {
//   const [image, setImage] = useState(null);
//   const [matches, setMatches] = useState([]);
//   const webcamRef = useRef(null); // Initialize webcamRef with useRef

//   const capture = () => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     setImage(imageSrc);
//   };

//   const handleUpload = async () => {
//     if (!image) {
//       alert('Please capture an image first.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', image);

//     try {
//       const response = await axios.post('http://localhost:5000/process_group_image', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       setMatches(response.data.matches);
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       alert('Failed to process image.');
//     }
//   };

//   return (
//     <div>
//       <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
//       <button onClick={capture}>Capture Image</button>
//       <button onClick={handleUpload}>Upload for Authentication</button>

//       <div>
//         {matches.length > 0 && matches.map((userMatches, idx) => (
//           <div key={idx}>
//             <h4>Face {idx + 1}</h4>
//             {userMatches.length ? (
//               <ul>
//                 {userMatches.map((user, userIdx) => (
//                   <li key={userIdx}>{user}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No match found</p>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default GroupAuth;
