import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  isStarted: { type: Boolean, default: false },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Goal || mongoose.model("Goal", GoalSchema);
