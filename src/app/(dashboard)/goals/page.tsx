"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageContainer from "@/src/components/PageContainer";
import {
  Eye,
  Goal,
  Loader2,
  Play,
  Plus,
  SquarePen,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import useGoals from "@/src/hooks/useGoals";
import { Progress } from "@/components/ui/progress";
import { Field } from "@/components/ui/field";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ArrowUpRightIcon } from "lucide-react";

type Topic = {
  name: string;
  description: string;
};

type Goal = {
  title: string;
  description: string;
  topics: Topic[];
};

type UpdateGoal = {
  title: string;
  description: string;
};

const GoalPage = () => {
  const [open, setOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const router = useRouter();

  const {
    createGoal,
    goals,
    loadingGoals,
    isCreatingGoal,
    startGoal,
    isStartingGoal,
    deleteGoal,
    isDeletingGoal,
    updateGoal,
    isUpdatingGoal,
  } = useGoals();

  const selectedGoal = goals?.find((goal: any) => goal._id === selectedGoalId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<Goal>({
    defaultValues: {
      title: "",
      description: "",
      topics: [{ name: "", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "topics",
  });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    formState: { errors: errorsUpdate },
    reset: resetUpdate,
  } = useForm<UpdateGoal>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (selectedGoal && isUpdateOpen) {
      resetUpdate({
        title: selectedGoal.title,
        description: selectedGoal.description,
      });
    }
  }, [selectedGoal, resetUpdate, isUpdateOpen]);

  const onsubmit = async (data: Goal) => {
    await createGoal(data);
    setOpen(false);
    reset();
  };

  const handleEditGoal = async (data: UpdateGoal) => {
    const updatedData = {
      ...data,
      id: selectedGoalId,
    };
    await updateGoal(updatedData);
    setIsUpdateOpen(false);
    setSelectedGoalId(null);
  };

  if (loadingGoals) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 size={50} className="animate-spin" />
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-2xl">Goals</h1>

        {/* CREATE GOAL DIALOG */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90%]">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <form onSubmit={handleSubmit(onsubmit)}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter your title"
                      {...register("title", {
                        required: "Title is required",
                      })}
                    />
                    {errors.title && (
                      <span className="text-destructive text-sm">
                        {errors.title.message}
                      </span>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Enter your description"
                      {...register("description", {
                        required: "Description is required",
                      })}
                    />
                    {errors.description && (
                      <span className="text-destructive text-sm">
                        {errors.description.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <Label>Topics</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ name: "", description: "" })}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Add Topic
                      </Button>
                    </div>

                    {fields.map((field, index) => (
                      <Card key={field.id} className="p-4">
                        <div className="grid gap-3">
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Topic title"
                              {...register(`topics.${index}.name`, {
                                required: "Topic title required",
                              })}
                            />
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                          <Input
                            placeholder="Topic description"
                            {...register(`topics.${index}.description`)}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Button type="submit" disabled={isCreatingGoal}>
                    {isCreatingGoal ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Goal"
                    )}
                  </Button>
                </div>
              </form>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {goals?.length ? (
        <div className="mt-6 grid md:grid-cols-2 grid-cols-1 gap-6">
          {goals?.map((goal: any, idx: number) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="text-xl">{goal.title}</CardTitle>
                <CardAction className="w-40 flex items-center gap-2">
                  {goal.isStarted && goal.progress !== 100 ? (
                    <Field>
                      <div className="flex items-center justify-between text-xs">
                        <span>Progress</span> <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} />
                    </Field>
                  ) : goal.progress === 100 ? (
                    <Badge className="ml-auto">Completed</Badge>
                  ) : (
                    <Button
                      className="ml-auto"
                      variant="outline"
                      onClick={() => startGoal(goal?._id)}
                      disabled={isStartingGoal}
                    >
                      <Play />
                      {isStartingGoal ? <>Starting...</> : "Start"}
                    </Button>
                  )}
                </CardAction>
              </CardHeader>
              <CardContent>{goal.description}</CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {goal?.topics?.length}{" "}
                  {goal?.topics?.length === 1 ? "topic" : "topics"}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/goals/${goal._id}`)}
                  >
                    <Eye />
                    View
                  </Button>

                  {/* EDIT GOAL DIALOG - Only Title & Description */}
                  <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedGoalId(goal._id)}
                      >
                        <SquarePen />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Goal</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={handleSubmitUpdate(handleEditGoal)}
                        className="flex flex-col gap-4"
                      >
                        <div className="grid gap-3">
                          <Label htmlFor="edit-title">Title</Label>
                          <Input
                            id="edit-title"
                            placeholder="Enter your title"
                            {...registerUpdate("title", {
                              required: "Title is required",
                            })}
                          />
                          {errorsUpdate.title && (
                            <span className="text-destructive text-sm">
                              {errorsUpdate.title.message}
                            </span>
                          )}
                        </div>

                        <div className="grid gap-3">
                          <Label htmlFor="edit-description">Description</Label>
                          <Input
                            id="edit-description"
                            placeholder="Enter your description"
                            {...registerUpdate("description", {
                              required: "Description is required",
                            })}
                          />
                          {errorsUpdate.description && (
                            <span className="text-destructive text-sm">
                              {errorsUpdate.description.message}
                            </span>
                          )}
                        </div>

                        <Button
                          type="submit"
                          disabled={isUpdatingGoal}
                          className="w-full"
                        >
                          {isUpdatingGoal ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            "Update Goal"
                          )}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* DELETE GOAL */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your goal from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          disabled={isDeletingGoal}
                          onClick={() => deleteGoal(goal._id)}
                        >
                          {isDeletingGoal ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="h-[60vh] flex items-center justify-center">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Goal />
              </EmptyMedia>
              <EmptyTitle>No Goals Yet</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t created any goals yet. Get started by creating
                your first goal by clicking the "New Goal" button above.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      )}
    </PageContainer>
  );
};

export default GoalPage;
