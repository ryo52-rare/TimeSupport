import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login/LoginPage";
import SignUp from "./SignUp/SignUp";
import CourseSelect from "./CourseSelect/CourseSelect";
import Dashboard from "./Dashboard/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/course" element={<CourseSelect />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
