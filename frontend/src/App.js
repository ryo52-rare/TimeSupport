import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login/LoginPage";
import SignUp from "./SignUp/SignUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
