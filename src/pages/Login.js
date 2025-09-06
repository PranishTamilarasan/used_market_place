import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Eye, EyeOff } from "lucide-react";
import API from "../services/api";
import '../styles.css';

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      alert("✅ Logged in successfully!");
      navigate("/"); // redirect after login
    } catch (err) {
      alert("❌ " + (err.response?.data?.msg || "Login failed"));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back 👋</h2>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Email */}
          <label className="form-label">
            Email
            <div className="input-group">
              <Mail className="input-icon" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="form-input"
              />
            </div>
          </label>

          {/* Password */}
          <label className="form-label">
            Password
            <div className="input-group">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="toggle-btn"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </label>

          {/* Remember me + Forgot */}
          <div className="options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <button type="button" className="forgot-btn">Forgot?</button>
          </div>

          {/* Submit */}
          <button type="submit" className="submit-btn">Sign in</button>
        </form>

        {/* Switch to Register */}
        <p className="switch-text">
          Don’t have an account?{" "}
          <button onClick={() => navigate("/register")} className="switch-link">
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
