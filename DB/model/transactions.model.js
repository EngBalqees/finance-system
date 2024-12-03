import mongoose, { Schema, model, Types } from "mongoose";
import budget from "./budget.model.js";
const transactionSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String
    }
})

// Middleware to validate transactions
transactionSchema.pre('save', async function (next) {
    if (this.type === 'expense') {
        try {
          // Fetch budgets for the user
          const budgets = await budget.find({ userId: this.userId });
    
          // Check if the category matches any budget title
          const relevantBudget = budgets.find(budget => budget.title === this.category);
    
          if (!relevantBudget) {
            throw new Error('Category does not match any existing budget title.');
          }
    
          // Check if transaction amount exceeds the budget limit
          const remainingAmount = relevantBudget.amount - relevantBudget.spent;
          if (this.amount > remainingAmount) {
            throw new Error('Transaction amount exceeds the budget limit.');
          }
        } catch (error) {
          return next(error); // Pass error to the next middleware to prevent transaction creation
        }
      }
      next(); // Proceed with saving the transaction if validation passes
  });

const Transaction = mongoose.model("Transaction", transactionSchema);
export  default Transaction;
