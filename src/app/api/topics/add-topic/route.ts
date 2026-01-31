import { auth } from "@/auth";
import connectDB from "@/src/lib/db";
import Activity from "@/src/models/Activity";
import Goal from "@/src/models/Goal";
import Topic from "@/src/models/Topic";

export const POST = async (req: Request) => {
  try {
    const { id, name, description } = await req.json();

    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const topic = await Topic.create({
      name,
      description,
      goal: id,
    });

    const goal = await Goal.findByIdAndUpdate(id, {
      $push: { topics: topic._id },
    });

    await Activity.create({
      goalId: id,
      user: session?.user?.id,
      type: "Topic Added",
      message: `Topic "${name}" added in goal "${goal.name}"`,
    });

    return Response.json({ message: "Topic added successfully", topic, goal });
  } catch (err) {
    console.log(err);
    return Response.json({ message: "Error adding topic", error: err });
  }
};
