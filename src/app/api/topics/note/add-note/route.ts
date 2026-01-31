import { auth } from "@/auth";
import connectDB from "@/src/lib/db";
import Activity from "@/src/models/Activity";
import Goal from "@/src/models/Goal";
import Note from "@/src/models/Note";
import Topic from "@/src/models/Topic";

export const POST = async (req: Request) => {
  try {
    await connectDB();

    const { topicId, content } = await req.json();

    const session = await auth();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const goal = await Goal.findOne({ topics: topicId });

    const newNote = await Note.create({ topic: topicId, content });

    const topic = await Topic.findByIdAndUpdate(topicId, { note: newNote._id });

    if (!newNote || !topic) {
      return new Response("Note not added", { status: 404 });
    }

    await Activity.create({
      user: session?.user?.id,
      goal: goal?._id,
      type: "Note Added",
      message: `Note added in topic "${topic?.name}" in goal "${goal?.title}"`,
    });

    return new Response("Note added", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
