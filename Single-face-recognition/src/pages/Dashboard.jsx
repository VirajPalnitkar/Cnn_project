import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';

export default function Dashboard(){
    const navigate=useNavigate();
    function handleRegisterClick(){
        navigate('/dashboard/register');
    }
    function handleMarkClick(){
        navigate('/dashboard/mark');
    }    

    return(<>
        <h2><b>Dashboard</b></h2>
        <div className="dashboard">
            <div className="Choice">
                <h1>
                    Individual face recognition
                </h1>
                <button onClick={handleRegisterClick}>Register</button>
                <button onClick={handleMarkClick}>Mark Attendance</button>
            </div>
            <div className="Choice">
                <h1>
                    Multiple face recognition
                </h1>
            </div>
            <div className="Choice">
                <h1>
                    Crowd detection
                </h1>
            </div>
        </div>
        </>);
};