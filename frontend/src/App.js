import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login/LoginPage";
import SignUp from "./SignUp/SignUp";
import CourseSelect from "./CourseSelect/CourseSelect";
import Dashboard from "./Dashboard/Dashboard";
import Setting from "./Setting/Setting";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/course" element={<CourseSelect />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </Router>
  );
}

export default App;
