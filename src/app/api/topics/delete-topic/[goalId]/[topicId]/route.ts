import { auth } from "@/auth";
import connectDB from "@/src/lib/db";
import Activity from "@/src/models/Activity";
import Goal from "@/src/models/Goal";
import Topic from "@/src/models/Topic";

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ goalId: string; topicId: string }> },
) => {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { goalId, topicId } = await params;
    console.log(goalId, topicId);

    const goal = await Goal.findOneAndUpdate(
      { _id: goalId, user: session.user.id },
      { $pull: { topics: topicId } },
      { new: true },
    );

    if (!goal) {
      return Response.json({ message: "Goal not found" }, { status: 404 });
    }

    const topic = await Topic.findByIdAndDelete(topicId);

    if (!topic) {
      return Response.json({ message: "Topic not found" }, { status: 404 });
    }

    await Activity.create({
      goalId: goal?._id,
      user: session?.user?.id,
      type: "Topic Deleted",
      message: `Topic "${topic.name}" deleted in goal "${goal.title}"`,
    });

    return Response.json(
      { message: "Topic deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE topic error:", error);
    return Response.json({ message: "Error deleting topic" }, { status: 500 });
  }
};
