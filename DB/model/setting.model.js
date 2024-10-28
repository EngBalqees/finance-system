import mongoose, { Schema, model, Types } from "mongoose";

const settingSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    }, // null for global settings
    currency: {
        type: String,
        default: "USD"
    }, // e.g., USD, EUR, GBP
    language: {
        type: String,
        default: "en"
    }, // e.g., en for English, ar for Arabic
    theme: {
        type: String,
        default: "light"
    }, // e.g., light, dark
    notifications: {
        type: Boolean,
        default: true
    }, // Enable/disable notifications
    budgetAlerts: {
        type: Boolean,
        default: true
    }, // Alerts if budget is exceeded
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

const Setting = mongoose.model("Setting", settingSchema);
export default  Setting;
