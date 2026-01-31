import { auth } from "@/auth";
import connectDB from "@/src/lib/db";
import Activity from "@/src/models/Activity";
import Goal from "@/src/models/Goal";
import Note from "@/src/models/Note";
import Topic from "@/src/models/Topic";

export const DELETE = async (req: Request) => {
  try {
    await connectDB();
    const { id } = await req.json();
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const goal = await Goal.findById(id);

    if (!goal) {
      return new Response("Goal not found", { status: 404 });
    }

    console.log("Deleting goal:", goal);

    const topics = await Topic.find({ goal: id }).select("_id");
    const topicIds = topics.map((t) => String(t._id));

    console.log("Found topics:", topicIds);

    if (topicIds.length > 0) {
      await Note.deleteMany({ topic: { $in: topicIds } });
      console.log("Notes deleted");
    }

    await Topic.deleteMany({ goal: id });
    console.log("Topics deleted");

    await Activity.deleteMany({ goalId: id });
    console.log("Activities deleted");

    await Activity.create({
      goalId: goal._id,
      user: session?.user?.id,
      type: "Goal Deleted",
      message: `Goal "${goal.title}" deleted`,
    });

    await Goal.findByIdAndDelete(id);
    console.log("Goal deleted");

    return new Response(
      JSON.stringify({ message: "Goal and related data deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error deleting goal:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
