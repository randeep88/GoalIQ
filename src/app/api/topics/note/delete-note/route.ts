import { auth } from "@/auth";
import connectDB from "@/src/lib/db";
import Activity from "@/src/models/Activity";
import Goal from "@/src/models/Goal";
import Note from "@/src/models/Note";
import Topic from "@/src/models/Topic";

export const DELETE = async (req: Request) => {
  try {
    await connectDB();

    const { noteId } = await req.json();

    const session = await auth();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const topic = await Topic.findOneAndUpdate(
      { note: noteId },
      { $pull: { note: noteId } },
      { new: true },
    );

    const note = await Note.findByIdAndDelete(noteId);

    const goal = await Goal.findOne({ topics: topic._id });

    if (!note) {
      return new Response("Note not found", { status: 404 });
    }

    await Activity.create({
      goalId: goal?._id,
      user: session?.user?.id,
      type: "Note Deleted",
      message: `Note deleted in topic "${topic.name}" in goal "${goal?.title}"`,
    });

    return new Response("Note deleted", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
