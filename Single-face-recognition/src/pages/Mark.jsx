import '../styles/Mark.css';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Mark() {
  const [details, setDetails] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="mark">
      <h1>Scan your QR code</h1>
      <div className="scanner">
        <Scanner
          onScan={(result) => {
            const scannedDetails = result[0].rawValue.split(',');
            setDetails(scannedDetails);
            console.log(scannedDetails);
          }}
        />
        {details && (
          <div>
            <p>Name: {details[1]}</p>
            <p>Father Name: {details[2]}</p>
            <p>Roll no: {details[0]}</p>
            <p>Mobile no: {details[4]}</p>  {/* Assuming mobile number is in index 3 */}
            <button onClick={() => {
              navigate('/dashboard/mark/capture', { state: { mobileNumber: details[4] } });
            }}>
              Take photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
