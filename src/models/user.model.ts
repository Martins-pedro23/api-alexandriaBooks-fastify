import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: {type: String, required: true},
    createdAt: { type: Date, default: Date.now, required: false},
    birthDate: { type: Date, required: false},
    address: { type: String, required: false},
    phone: { type: String, required: false},
});

export default mongoose.model("User", userSchema);