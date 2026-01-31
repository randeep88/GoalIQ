import { auth } from "@/auth";
import connectDB from "@/src/lib/db";
import Goal from "@/src/models/Goal";
import Note from "@/src/models/Note";
import Topic from "@/src/models/Topic";
import { Types } from "mongoose";

// Ensure models are registered to prevent MissingSchemaError during population
[Goal, Note, Topic];

export const GET = async () => {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const topics = await Topic.find({});
    if (!topics) {
      return Response.json({ message: "Topics not found" }, { status: 404 });
    }

    const goals = await Goal.find({
      user: new Types.ObjectId(session.user.id),
    })
      .populate({
        path: "topics",
        populate: {
          path: "note",
        },
        select: "name description isCompleted note",
      })
      .lean();

    const goalsWithProgress = goals.map((goal: any) => {
      const totalTopics = goal.topics.length;
      const completedTopics = goal.topics.filter(
        (topic: any) => topic.isCompleted,
      ).length;

      const progress =
        totalTopics === 0
          ? 0
          : Math.round((completedTopics / totalTopics) * 100);

      return {
        ...goal,
        progress,
      };
    });

    return Response.json({
      message: "Goals fetched successfully",
      data: goalsWithProgress,
    });
  } catch (error: any) {
    console.error("GET /goals error:", error);
    return Response.json(
      { message: "Server error", errorMessage: error.message },
      { status: 500 },
    );
  }
};
