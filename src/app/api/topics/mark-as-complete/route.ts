import { auth } from "@/auth";
import Activity from "@/src/models/Activity";
import Goal from "@/src/models/Goal";
import Topic from "@/src/models/Topic";

export const PATCH = async (req: Request) => {
  try {
    const { topicId } = await req.json();

    const session = await auth();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const goal = await Goal.findOne({ topics: topicId });

    const topic = await Topic.findByIdAndUpdate(topicId, {
      $set: { isCompleted: true },
    });

    if (!topic) {
      return new Response("Topic not found", { status: 404 });
    }

    await Activity.create({
      goalId: goal?._id,
      user: session.user.id,
      type: "Topic Marked As Complete",
      message: `Topic ${topic.name} marked as complete in goal ${goal?.title}`,
    });

    return new Response("Topic marked as complete", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
