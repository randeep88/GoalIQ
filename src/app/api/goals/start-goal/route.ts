import { auth } from "@/auth";
import connectDB from "@/src/lib/db";
import Activity from "@/src/models/Activity";
import Goal from "@/src/models/Goal";

export const PATCH = async (req: Request) => {
  try {
    const { goalId } = await req.json();
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const prevGoal = await Goal.findOne({ _id: goalId, user: session.user.id });

    console.log(prevGoal)

    if (!prevGoal) {
      return Response.json({ message: "Goal not found" }, { status: 404 });
    }

    if (prevGoal.isStarted) {
      return Response.json(
        { message: "Goal already started" },
        { status: 400 },
      );
    }

    const goal = await Goal.findOneAndUpdate(
      { _id: goalId, user: session.user.id },
      { $set: { isStarted: true } },
      { new: true },
    );

    if (!goal) {
      return Response.json({ message: "Goal not found" }, { status: 404 });
    }

    await Activity.create({
      goalId,
      user: session.user.id,
      type: "Goal Started",
      message: `Started goal "${goal.title}"`,
    });

    return Response.json({
      message: "Goal Started",
      data: goal,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Error starting goal" }, { status: 500 });
  }
};
