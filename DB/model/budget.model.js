import mongoose, { Schema, model, Types } from "mongoose";

const budgetSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: String,
        required: true
    }, // e.g., "Groceries", "Rent"
    amount: {
        type: Number,
        required: true
    }, // Total budgeted amount for the category
    currentSpending: {
        type: Number,
        default: 0
    }, // Tracks current spending in this category
    month: {
        type: Number,
        required: true
    }, // Month for the budget (1 = January, 12 = December)
    year: {
        type: Number,
        required: true
    } // Year for the budget
});
const budget = mongoose.model("budget",budgetSchema);
export default budget;