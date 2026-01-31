import { auth } from "@/auth";
import connectDB from "@/src/lib/db";
import Activity from "@/src/models/Activity";
import Goal from "@/src/models/Goal";

export const PATCH = async (req: Request) => {
  try {
    await connectDB();

    const { id, title, description } = await req.json();

    const session = await auth();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const goal = await Goal.findByIdAndUpdate(id, { title, description });

    if (!goal) {
      return new Response("Goal not found", { status: 404 });
    }

    await Activity.create({
      goalId: goal?._id,
      user: session?.user?.id,
      type: "Goal Updated",
      message: `Goal "${title}" updated`,
    });

    return new Response("Goal updated", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
