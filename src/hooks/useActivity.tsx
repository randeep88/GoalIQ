import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const useActivity = () => {
  // Get Goals
  const { data: activity, isPending: loadingActivity } = useQuery({
    queryKey: ["activity"],
    queryFn: async () => {
      const res = await axios.get("/api/activity/get-activity");
      return res.data.data;
    },
  });

  return { activity, loadingActivity };
};

export default useActivity;
