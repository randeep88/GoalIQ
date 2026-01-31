"use client";

import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useTopics = (goalId?: string) => {
  const queryClient = useQueryClient();

  //Add topic
  const { mutate: addTopic, isPending: isAddingTopic } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post("/api/topics/add-topic", data);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Topic added successfully");
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
      queryClient.invalidateQueries({ queryKey: ["goal", goalId] });
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  // Delete Goal
  const { mutate: deleteTopic, isPending: isDeletingTopic } = useMutation({
    mutationFn: async ({
      goalId,
      topicId,
    }: {
      goalId: string;
      topicId: string;
    }) => {
      const res = await axios.delete(
        `/api/topics/delete-topic/${goalId}/${topicId}`,
      );
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Topic deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
      queryClient.invalidateQueries({ queryKey: ["goal", goalId] });
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  // Update Goal
  const { mutate: updateTopic, isPending: isUpdatingTopic } = useMutation({
    mutationFn: async (data: any) => {
      console.log(data);
      const res = await axios.patch("/api/topics/update-topic", {
        topicId: data.id,
        content: data.content,
      });
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Topic updated successfully");
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
      queryClient.invalidateQueries({ queryKey: ["goal", goalId] });
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  // start Goal
  const { mutate: markAsComplete, isPending: isMarkingAsComplete } =
    useMutation({
      mutationFn: async (topicId: string) => {
        const res = await axios.patch(`/api/topics/mark-as-complete`, {
          topicId,
        });
        return res.data.data;
      },
      onSuccess: () => {
        toast.success("Topic marked as complete successfully");
        queryClient.invalidateQueries({ queryKey: ["goals"] });
        queryClient.invalidateQueries({ queryKey: ["activity"] });
        queryClient.invalidateQueries({ queryKey: ["goal", goalId] });
      },
      onError: (error: any) => {
        toast.error(error.response.data.message);
      },
    });

  //add note
  const { mutate: addNote, isPending: isAddingNote } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post(`/api/topics/note/add-note`, data);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Note added successfully");
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
      queryClient.invalidateQueries({ queryKey: ["goal", goalId] });
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  return {
    addTopic,
    deleteTopic,
    updateTopic,
    markAsComplete,
    isAddingTopic,
    isDeletingTopic,
    isUpdatingTopic,
    isMarkingAsComplete,
    addNote,
    isAddingNote,
  };
};

export default useTopics;
