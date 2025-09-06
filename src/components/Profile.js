import React, { useState, useEffect } from "react";
import API from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null); // store user data
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);

  // Fetch user profile from backend on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const response = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        setForm(response.data.user);
        setPreviewPic(response.data.user.profilePic || null);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewPic(URL.createObjectURL(file));
      setForm((prev) => ({ ...prev, profilePicFile: file }));
    }
  };

  // Handle save button click - send update to backend and update state
  const handleSave = async (e) => {
    e.preventDefault();
    const { profilePicFile, ...userData } = form;

    try {
      const token = localStorage.getItem("token");
      const response = await API.put("/auth/me", userData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data.user);
      setForm(response.data.user);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>Please login to view profile.</p>;

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>

      <div className="profile-section">
        <div className="profile-pic-wrapper">
          <img
            src={previewPic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-pic"
          />
          {editMode && (
            <label className="upload-btn">
              Change Picture
              <input type="file" accept="image/*" onChange={handlePicChange} hidden />
            </label>
          )}
        </div>

        <form className="profile-form" onSubmit={handleSave}>
          <label>
            First Name
            <input
              name="firstname"
              value={form.firstname || ""}
              onChange={handleChange}
              disabled={!editMode}
              required
            />
          </label>

          <label>
            Last Name
            <input
              name="lastname"
              value={form.lastname || ""}
              onChange={handleChange}
              disabled={!editMode}
              required
            />
          </label>

          <label>
            Username
            <input
              name="username"
              value={form.username || ""}
              onChange={handleChange}
              disabled={!editMode}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              disabled={!editMode}
              required
            />
          </label>

          <label>
            Phone Number
            <input
              type="tel"
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              disabled={!editMode}
            />
          </label>

          <label>
            Gender
            <select
              name="gender"
              value={form.gender || ""}
              onChange={handleChange}
              disabled={!editMode}
              required
            >
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="prefer_not_say">Prefer not to say</option>
            </select>
          </label>

          <label>
            Age
            <input
              type="number"
              name="age"
              min="0"
              value={form.age || ""}
              onChange={handleChange}
              disabled={!editMode}
            />
          </label>

          <div className="form-actions">
            {!editMode ? (
              <button type="button" onClick={() => setEditMode(true)} className="edit-btn">
                Edit Profile
              </button>
            ) : (
              <>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setForm(user); // revert form to current user data on cancel
                    setPreviewPic(user.profilePic || null);
                    setEditMode(false);
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
