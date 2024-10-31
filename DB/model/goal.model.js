import mongoose, { Schema, model, Types } from "mongoose";

const goalSchema = new Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
         required: true 
        },
  name: { 
    type: String,
     required: true
     }, // e.g., "Vacation to Spain"
     description: {
      type: String,
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    currentAmount: {
      type: Number,
      default: 0, // To track how much has been saved towards the goal
    },
    deadline: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'], // Define priority levels
      default: 'medium', // Default priority
    },
    progressPercentage: {
      type: Number,
      default: 0, // Calculate the progress percentage based on currentAmount/targetAmount
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
// Middleware to calculate progress percentage before saving
goalSchema.pre('save', function (next) {
   if (this.targetAmount > 0) {
     this.progressPercentage = (this.currentAmount / this.targetAmount) * 100;
   } else {
     this.progressPercentage = 0; // Avoid division by zero
   }
   next();
 });
 
const goal = mongoose.model("goal",goalSchema);
export default goal;