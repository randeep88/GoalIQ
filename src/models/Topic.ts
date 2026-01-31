import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
  goal: { type: mongoose.Schema.Types.ObjectId, ref: "Goal" },
  name: { type: String, required: true },
  description: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  note: { type: mongoose.Schema.Types.ObjectId, ref: "Note" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Topic || mongoose.model("Topic", TopicSchema);
