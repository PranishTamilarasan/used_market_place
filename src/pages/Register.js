import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles.css";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      checkStrength(value);
    }
  };

  const checkStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setStrength(score);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("❌ Passwords do not match");
      return;
    }
    try {
      await API.post("/auth/register", { email: form.email, password: form.password, username: form.email.split("@")[0] });
      alert("✅ Account created! Please login.");
      navigate("/login");
    } catch (err) {
      alert("❌ " + (err.response?.data?.msg || "Registration failed"));
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2>Create Your Account ✨</h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="confirm"
              placeholder="Repeat password"
              value={form.confirm}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Strength */}
          <div className="strength-meter">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`strength-bar ${i < strength ? "filled" : ""}`}
              ></div>
            ))}
            <p className="strength-text">
              Password strength: {["Very weak", "Weak", "Okay", "Good", "Strong"][strength]}
            </p>
          </div>

          {/* Submit */}
          <button type="submit" className="submit-btn">Create Account</button>
        </form>

        {/* Switch to login */}
        <p className="switch-text">
          Already have an account?{" "}
          <button className="switch-link" onClick={() => navigate("/login")}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
