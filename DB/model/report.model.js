import mongoose, { Schema, model, Types } from "mongoose";

const reportSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reportType: {
        type: String,
        required: true
    }, // e.g., "Monthly", "Quarterly", "Yearly"
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed
    }, // Stores the generated report data
    generatedAt: {
        type: Date,
        default: Date.now
    }
})

const Report = mongoose.model("Report", reportSchema);
export default  Report;