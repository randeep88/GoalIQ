import { auth } from "@/auth";
import connectDB from "@/src/lib/db";
import Goal from "@/src/models/Goal";
import Topic from "@/src/models/Topic";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ goalId: string }> },
) => {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { goalId } = await params;

    const topics = await Topic.find({ goal: goalId });
    if (!topics) {
      return Response.json({ message: "Topics not found" }, { status: 404 });
    }

    const goal = await Goal.findById(goalId)
      .populate({
        path: "topics",
        populate: {
          path: "note",
        },
        select: "name description isCompleted note",
      })
      .lean();

    if (!goal) {
      return Response.json({ message: "Goal not found" }, { status: 404 });
    }

    const totalTopics = goal.topics.length;
    const completedTopics = goal.topics.filter(
      (topic: any) => topic.isCompleted,
    ).length;

    const progress =
      totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);

    return Response.json({
      message: "Goal fetched successfully",
      data: { ...goal, progress },
    });
  } catch (error: any) {
    console.error("GET /goals error:", error);
    return Response.json(
      { message: "Server error", errorMessage: error.message },
      { status: 500 },
    );
  }
};
