import { auth } from "@/auth";
import connectDB from "@/src/lib/db";
import Activity from "@/src/models/Activity";

export const GET = async () => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const activity = await Activity.find({ user: session.user.id }).sort({
      createdAt: -1,
    });

    return Response.json({
      message: "Activity fetched successfully",
      data: activity,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Error fetching activity", error });
  }
};
