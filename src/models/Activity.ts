import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: "Goal" },
  type: {
    type: String,
    enum: [
      "Goal Created",
      "Goal Started",
      "Goal Completed",
      "Goal Updated",
      "Goal Deleted",

      "Topic Added",
      "Topic Updated",
      "Topic Marked As Complete",
      "Topic Deleted",

      "Note Added",
      "Note Updated",
      "Note Deleted",
    ],
    required: true,
  },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Activity ||
  mongoose.model("Activity", ActivitySchema);
