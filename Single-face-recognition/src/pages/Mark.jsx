import '../styles/Mark.css';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Mark() {
  const [details,setDetails]=useState(null);
  const navigate=useNavigate();
  return (
    <div className="mark">
      <h1>Scan your QR code</h1>
      <div className="scanner">
        <Scanner
          onScan={(result) => {
            setDetails(result[0].rawValue.split(','));
            console.log(result);

          }}
        />
        {details && 
        <div>
          <p>Name:- {details[1]}</p>
          <p>Father Name:- {details[2]}</p>
          <p>Roll no:- {details[0]}</p>
          <p>Mobile no:_</p>
          <button onClick={()=>{navigate('/dashboard/mark/capture')}}>Take photo</button>
        </div> 
        }
      </div>
    </div>
  );
}
