import { BrowserRouter as Router , Routes , Route } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from "./pages/Register";
import Mark from "./pages/Mark";
import Capture from "./pages/Capture";

function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/dashboard/register" element={<Register/>}/>
        <Route path="/dashboard/mark" element={<Mark/>}/>
        <Route path="/dashboard/mark/capture" element={<Capture/>}/>
      </Routes>
    </Router>
  );
}
export default App;