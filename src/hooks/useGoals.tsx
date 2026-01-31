"use client";

import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useGoals = (goalId?: string) => {
  const queryClient = useQueryClient();
  // Get Goals
  const {
    data: goals,
    isPending: loadingGoals,
    error,
  } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const res = await axios.get("/api/goals/get-goals");
      return res.data.data;
    },
  });

  const {
    data: goal,
    isPending: loadingGoal,
    error: goalError,
  } = useQuery({
    enabled: !!goalId,
    queryKey: ["goal", goalId],
    queryFn: async () => {
      const res = await axios.get(`/api/goals/get-goal/${goalId}`);
      return res.data.data;
    },
  });

  // Create Goal
  const { mutate: createGoal, isPending: isCreatingGoal } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post("/api/goals/create-goal", data);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Goal created successfully");
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
      queryClient.invalidateQueries({ queryKey: ["goal", goalId] });
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  // Delete Goal
  const { mutate: deleteGoal, isPending: isDeletingGoal } = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete("/api/goals/delete-goal", {
        data: { id },
      });
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Goal deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
      queryClient.invalidateQueries({ queryKey: ["goal", goalId] });
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  // Update Goal
  const { mutate: updateGoal, isPending: isUpdatingGoal } = useMutation({
    mutationFn: async (data: any) => {
      console.log(data);
      const res = await axios.patch("/api/goals/update-goal", {
        id: data.id,
        title: data.title,
        description: data.description,
      });
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Goal updated successfully");
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
      queryClient.invalidateQueries({ queryKey: ["goal", goalId] });
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  // start Goal
  const { mutate: startGoal, isPending: isStartingGoal } = useMutation({
    mutationFn: async (goalId: string) => {
      const res = await axios.patch("/api/goals/start-goal", { goalId });
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Goal started successfully");
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
      queryClient.invalidateQueries({ queryKey: ["goal", goalId] });
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  return {
    goal,
    loadingGoal,
    createGoal,
    goals,
    loadingGoals,
    isCreatingGoal,
    deleteGoal,
    isDeletingGoal,
    updateGoal,
    isUpdatingGoal,
    startGoal,
    isStartingGoal,
  };
};

export default useGoals;
