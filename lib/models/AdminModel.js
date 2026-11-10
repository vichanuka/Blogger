import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  name: {
    type: String,
    default: "Admin",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const AdminModel = mongoose.models.admin || mongoose.model("admin", Schema);

export default AdminModel;

