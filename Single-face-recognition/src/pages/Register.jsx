import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import '../styles/Register.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import axios to send requests

const Register = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page reload
    if (!capturedImage || !username || !phoneNumber) {
      alert('Please fill in all the details and capture an image');
      return;
    }
  
    // Convert the base64 image to a blob to send it as FormData
    const blob = await fetch(capturedImage).then(res => res.blob());
  
    // Create FormData object to send the image and the form details
    const formData = new FormData();
    formData.append('file', blob, 'captured-image.jpg');  // Append the captured image
    formData.append('username', username);                // Append the username
    formData.append('phoneNumber', phoneNumber);          // Append the phone number
  
    try {
      // Update the URL to point to Flask's URL
      const response = await axios.post('http://127.0.0.1:5000/dashboard/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response from backend:', response.data);  // Check backend response
      alert('Successfully registered');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error uploading data:', error);
      alert('Failed to register');
    }
  };
  

  return (
    <div>
      <h2>Welcome to the registration</h2>
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
            <div>
              <h3>Captured Image:</h3>
              <img src={capturedImage} alt="Captured" />
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}  // Update username state
                required
              />
              <input
                type="text"
                placeholder="Mobile number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}  // Update phoneNumber state
                required
              />
              <button type="submit">Register</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;



// // src/pages/Dashboard.jsx
// import React, { useRef, useState, useEffect } from 'react';
// import Webcam from 'react-webcam';
// import '../styles/Register.css';
// import { useNavigate } from 'react-router-dom';

// const Register = () => {
//   const webcamRef = useRef(null);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [model, setModel] = useState(null);

//   const navigate=useNavigate();

//   const capture = async () => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     setCapturedImage(imageSrc);
//     console.log(webcamRef);
//   };

//   function handleSubmit(){
//       navigate('/dashboard');
//       alert("Successfully registered");
//   }

//   return (
//     <div>
//       <h2>Welcome to the registration</h2>
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
//             <div>
//               <h3>Captured Image:</h3>
//               <img src={capturedImage} alt="Captured" />
//             </div>
//             <form onSubmit={handleSubmit}>
//               <input type="text" placeholder='Enter username'></input>
//               <input type='text' placeholder='Mobile number'></input>
//               <button type='submit'>Register</button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Register;
