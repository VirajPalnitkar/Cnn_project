import { BrowserRouter as Router , Routes , Route } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from "./pages/Register";
import Mark from "./pages/Mark";
import Capture from "./pages/Capture";
import GroupAuth from "./pages/Groupauth";
import Yolo_count from "./pages/Yolo_count";

function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/dashboard/register" element={<Register/>}/>
        <Route path="/dashboard/mark" element={<Mark/>}/>
        <Route path="/dashboard/mark/capture" element={<Capture/>}/>
        <Route path="/dashboard/multiple" element={<GroupAuth/>}/>
        <Route path="/dashboard/yolo" element={<Yolo_count/>}></Route>
      </Routes>
    </Router>
  );
}
export default App;