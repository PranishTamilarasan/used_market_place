import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";



const categories = ["Electronics", "Clothing", "Books", "Beauty", "Home", "Toys"];

export default function ProductCreate(req) {

    const navigate = useNavigate();


  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    image: null,
    owner: req.userId, // File object
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.price) {
      alert("Please fill all required fields.");
      return;
    }
    if (!form.image) {
      alert("Please select an image.");
      return;
    }
    
    setSubmitting(true);
    try {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("image", form.image);

      const token = localStorage.getItem("token");
      await API.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Product created successfully!");
      // Optionally clear form
      setForm({
        title: "",
        description: "",
        category: "",
        price: "",
        image: null,
      });
      setPreviewImage(null);
    } catch (error) {
      console.error("Create product error:", error);
      alert("Failed to create product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="product-create-container" style={{ maxWidth: "500px", margin: "2rem auto" }}>
        <button className="back-button"
        onClick={() => navigate(-1)} >
        ← Back
      </button>
      <h2>Create New Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Title*
          <input type="text" name="title" value={form.title} onChange={handleChange} required />
        </label>

        <label>
          Description*
          <textarea name="description" value={form.description} onChange={handleChange} required />
        </label>

        <label>
          Category*
          <select name="category" value={form.category} onChange={handleChange} required>
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <label>
          Price* (₹)
          <input
            type="number"
            min="0"
            step="0.01"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Product Image*
          <input type="file" accept="image/*" onChange={handleImageChange} required />
        </label>

        {previewImage && (
          <div style={{ margin: "1rem 0" }}>
            <img
              src={previewImage}
              alt="Preview"
              style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }}
            />
          </div>
        )}

        <button type="submit" disabled={submitting} style={{ marginTop: "1rem", padding: "10px 20px" }}>
          {submitting ? "Submitting..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
