import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles.css";

export default function Register() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: '',
    number: "",
    email: "",
    gender: "",
    age: "",
    password: "",
    confirm: "",
  });
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
    if (!form.gender) {
      alert("❌ Please select your gender");
      return;
    }
    if (form.age && (isNaN(form.age) || form.age <= 0)) {
      alert("❌ Please enter a valid age");
      return;
    }

    try {
      await API.post("/auth/register", {
        firstname: form.firstname,
        lastname: form.lastname,
        username: form.firstname + (form.lastname ? " " + form.lastname : ""), // creating username from names
        number: form.number,
        email: form.email,
        gender: form.gender,
        age: form.age,
        password: form.password,
      });
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
          <div className="input-group">
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={form.firstname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={form.lastname}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <input
              type="tel"
              name="number"
              placeholder="Phone Number"
              value={form.number}
              onChange={handleChange}
            />
          </div>

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

          <div className="input-group">
            <select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="prefer_not_say">Prefer not to say</option>
            </select>
          </div>

          <div className="input-group">
            <input
              type="number"
              name="age"
              placeholder="Age"
              min="1"
              value={form.age}
              onChange={handleChange}
            />
          </div>

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

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="confirm"
              placeholder="Confirm Password"
              value={form.confirm}
              onChange={handleChange}
              required
            />
          </div>

          <div className="strength-meter">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`strength-bar ${i < strength ? "filled" : ""}`}></div>
            ))}
            <p className="strength-text">
              Password strength: {["Very weak", "Weak", "Okay", "Good", "Strong"][strength]}
            </p>
          </div>

          <button type="submit" className="submit-btn">
            Create Account
          </button>
        </form>

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
