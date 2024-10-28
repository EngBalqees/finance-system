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
  targetAmount: { 
    type: Number, 
    required: true
 }, // The total amount user wants to save
  savedAmount: { 
    type: Number,
     default: 0 
    }, // Tracks current saved amount towards the goal
  deadline: {
     type: Date
     }, // Optional target completion date
  isCompleted: {
     type: Boolean, 
     default: false
     } // Tracks if the goal has been achieved 
});

const goal = mongoose.model("goal",goalSchema);
export default goal;