import SingleGoalPage from "@/src/components/SingleGoalPage";

const page = async ({ params }: { params: Promise<{ goalId: string }> }) => {
  const goalId = (await params).goalId;

  return <SingleGoalPage goalId={goalId} />;
};

export default page;
