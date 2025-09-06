import express from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Product.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Configure multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// POST /products - create new product listing (protected)
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !description || !category || !price || !imageUrl) {
      return res.status(400).json({ msg: "All fields are required including image" });
    }

    const newProduct = new Product({
      title,
      description,
      category,
      price,
      imageUrl,
      owner: req.userId,
    });

    await newProduct.save();
    res.status(201).json({ msg: "Product created", product: newProduct });
  } catch (error) {
    console.error("Product creation failed", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /products - get all products created by logged-in user (protected)
router.get("/", verifyToken, async (req, res) => {
  try {
    const products = await Product.find({ owner: req.userId });
    res.json(products);
  } catch (error) {
    console.error("Fetching products failed", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// PUT /products/:id - update product by ID (protected)
router.put("/:id", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    if (product.owner.toString() !== req.userId)
      return res.status(403).json({ msg: "Unauthorized" });

    const { title, description, category, price } = req.body;

    if (title) product.title = title;
    if (description) product.description = description;
    if (category) product.category = category;
    if (price) product.price = price;

    if (req.file) {
      product.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await product.save();
    res.json({ msg: "Product updated", product: updatedProduct });
  } catch (error) {
    console.error("Product update failed", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE /products/:id - delete product by ID (protected)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    if (product.owner.toString() !== req.userId)
      return res.status(403).json({ msg: "Unauthorized" });

    await product.deleteOne();
    res.json({ msg: "Product deleted" });
  } catch (error) {
    console.error("Product deletion failed", error);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
