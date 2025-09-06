import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    gender: {
      type: String,
      enum: ["female", "male", "other", "prefer_not_say"],
      default: "prefer_not_say",
    },
    age: { type: Number, min: 0 },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
