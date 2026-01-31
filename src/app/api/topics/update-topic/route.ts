import { auth } from "@/auth";
import connectDB from "@/src/lib/db";
import Activity from "@/src/models/Activity";
import Goal from "@/src/models/Goal";
import Topic from "@/src/models/Topic";

export const PATCH = async (req: Request) => {
  try {
    await connectDB();

    const { id, name, description } = await req.json();

    const session = await auth();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const topic = await Topic.findByIdAndUpdate(id, { name, description });

    if (!topic) {
      return new Response("Topic not found", { status: 404 });
    }

    const goal = await Goal.findOne({ topics: topic._id });

    await Activity.create({
      goalId: goal?._id,
      user: session?.user?.id,
      type: "Topic Updated",
      message: `Topic "${topic?.name}" updated in goal "${goal?.title}"`,
    });

    return new Response("Topic updated", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
