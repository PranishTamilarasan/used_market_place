import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";


const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

function App() {
  return (
    <Router>
    
      <Routes>
        {/* Public routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Authenticated home route */}
        <Route
          path="/"
          element={
            isAuthenticated() ? <Home /> : <Navigate to="/login" />
          }
        />
        <Route path="/Profile" element={<Profile />} />

        {/* Catch-all 404 */}
        <Route path="*" element={<h2 className="text-center mt-20">404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
