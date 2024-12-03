import mongoose, { Schema, model, Types } from "mongoose";

const budgetSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ['savings', 'expenses', 'investments'], // Define budget types
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      spent: {
        type: Number,
        default: 0, // Amount spent from the budget
      },
      status: {
        type: String,
        enum: ['active', 'achieved', 'expired'], // Define budget statuses
        default: 'active', // Default status is active
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,

      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
});
// Middleware to update budget status based on the end date
budgetSchema.pre("save", function (next) {
  const currentDate = new Date();

  if (this.endDate && this.endDate < currentDate) {
    this.status = "expired"; // Mark as expired if the end date has passed
  } else if (this.spent >= this.amount) {
    this.status = "achieved"; // Mark as achieved if the spent amount reaches or exceeds the budgeted amount
  } else {
    this.status = "active"; // Keep status active if neither condition is met
  }

  next();
});
  
const budget = mongoose.model("budget",budgetSchema);
export default budget;