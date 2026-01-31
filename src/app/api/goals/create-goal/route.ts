import { auth } from "@/auth";
import connectDB from "@/src/lib/db";
import Activity from "@/src/models/Activity";
import Goal from "@/src/models/Goal";
import Topic from "@/src/models/Topic";

export const POST = async (req: Request) => {
  try {
    const { title, description, topics } = await req.json();

    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const topicIds = await Promise.all(
      topics.map(async (topic: any) => {
        const createdTopic = await Topic.create({
          name: topic.name,
          description: topic.description,
        });
        return createdTopic._id;
      }),
    );

    const goal = await Goal.create({
      user: session.user.id,
      title,
      description,
      isStarted: false,
      topics: topicIds,
    });

    await Activity.create({
      goalId: goal?._id,
      user: session?.user?.id,
      type: "Goal Created",
      message: `Goal "${title}" created`,
    });

    await Promise.all(
      topics.map(async (topic: any) => {
        await Activity.create({
          goalId: goal?._id,
          user: session?.user?.id,
          type: "Topic Added",
          message: `Topic "${topic.name}" added in goal "${title}"`,
        });
      }),
    );

    return Response.json({ message: "New Goal Created", goal });
  } catch (err) {
    console.log(err);
    return Response.json({ message: "Error creating goal", error: err });
  }
};
