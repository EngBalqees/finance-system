
import mongoose, { Schema, model, Types } from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }, // Hashed with bcrypt
    role: {
        type: String,
        enum: ['user', 'superAdmin'],
        default: 'user'
    }, // Role-based control
    createdAt: {
        type: Date,
        default: Date.now
    },
});
const User = mongoose.model('User',UserSchema);
export default User;