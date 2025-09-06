import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import ProductCreate from "./components/ProductCreate";
import MyProducts from "./components/MyProducts";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={isAuthenticated() ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/Profile"
          element={isAuthenticated() ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/ProductCreate"
          element={isAuthenticated() ? <ProductCreate /> : <Navigate to="/login" />}
        />
        <Route
          path="/MyProducts"
          element={isAuthenticated() ? <MyProducts /> : <Navigate to="/login" />}
        />

        {/* Catch-all 404 */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
