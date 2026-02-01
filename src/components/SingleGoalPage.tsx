"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import useGoals from "@/src/hooks/useGoals";
import { ArrowLeft, BookOpen, Loader2, Play, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import PageContainer from "./PageContainer";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import useTopics from "../hooks/useTopic";
import { Textarea } from "@/components/ui/textarea";

type Topic = {
  name: string;
  description: string;
};
type UpdateTopic = {
  name: string;
  description: string;
};

const SingleGoalPage = ({ goalId }: { goalId: string }) => {
  const { goal, loadingGoal, startGoal, isStartingGoal } = useGoals(goalId);
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  console.log(loadingId);

  const {
    addTopic,
    isAddingTopic,
    deleteTopic,
    isDeletingTopic,
    updateTopic,
    isUpdatingTopic,
    markAsComplete,
    isMarkingAsComplete,
    addNote,
    isAddingNote,
  } = useTopics(goalId);

  const selectedTopic = goal?.topics?.find(
    (topic: any) => topic._id === selectedTopicId,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Topic>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    formState: { errors: errorsUpdate },
    reset: resetUpdate,
  } = useForm<UpdateTopic>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const {
    register: registerNote,
    handleSubmit: handleSubmitNote,
    formState: { errors: errorsNote },
  } = useForm<{ content: string }>();

  useEffect(() => {
    if (selectedTopic && isUpdateOpen) {
      resetUpdate({
        name: selectedTopic.name,
        description: selectedTopic.description,
      });
    }
  }, [selectedTopic, resetUpdate, isUpdateOpen]);

  const onsubmit = (data: Topic) => {
    const topic = {
      id: goalId,
      name: data.name,
      description: data.description,
    };

    addTopic(topic, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  const handleEditTopic = (data: Topic) => {
    const updatedTopic = {
      id: selectedTopicId,
      goalId: goalId,
      name: data.name,
      description: data.description,
    };

    updateTopic(updatedTopic, {
      onSuccess: () => {
        setIsUpdateOpen(false);
        reset();
      },
    });
  };

  const handleAddNote = (data: any) => {
    const note = {
      topicId: selectedTopicId,
      content: data.content,
    };
    addNote(note, {
      onSuccess: () => {
        setIsNoteOpen(false);
        reset();
      },
    });
  };

  if (loadingGoal) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 size={50} className="animate-spin" />
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="mb-5 flex items-center justify-between">
        <Button onClick={() => router.back()} variant="secondary">
          <ArrowLeft />
          Back
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus />
              Add Topic
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90%]">
            <DialogHeader>
              <DialogTitle>Add New Topic</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <form onSubmit={handleSubmit(onsubmit)}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      {...register("name", {
                        required: "Name is required",
                      })}
                    />
                    {errors.name && (
                      <span className="text-destructive text-sm">
                        {errors.name.message}
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

                  <Button type="submit" disabled={isAddingTopic}>
                    {isAddingTopic ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Topic"
                    )}
                  </Button>
                </div>
              </form>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{goal?.title}</h1>
          <p className="text-muted-foreground">{goal?.description}</p>
        </div>

        <div className="w-70 flex  items-center justify-end">
          {goal?.isStarted ? (
            <Field>
              <div className="flex items-center justify-between">
                <span>Progress</span> <span>{goal?.progress}%</span>
              </div>
              <Progress className="w-full h-2" value={goal?.progress} />
            </Field>
          ) : (
            <Button
              variant="secondary"
              className="ml-auto"
              onClick={() => startGoal(goal?._id)}
              disabled={isStartingGoal}
            >
              <Play />
              {isStartingGoal ? <>Starting...</> : "Start"}
            </Button>
          )}
        </div>
      </div>
      <Separator className="my-5" />
      <h1 className="text-xl mb-5">Topics</h1>
      {goal?.topics.length > 0 ? (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mb-20">
          {goal?.topics.map((topic: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{topic?.name}</CardTitle>
                <CardDescription>{topic?.description}</CardDescription>
                <CardAction>
                  {topic?.isCompleted ? (
                    <Badge variant="default">Completed</Badge>
                  ) : (
                    <Badge variant="destructive">Pending</Badge>
                  )}
                </CardAction>
              </CardHeader>
              <CardFooter className="flex items-center justify-end gap-2">
                {topic?.note ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">View Note</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Note</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-[30vh]">
                        <p>{topic?.note?.content}</p>
                      </ScrollArea>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Close</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Dialog open={isNoteOpen} onOpenChange={setIsNoteOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedTopicId(topic._id)}
                      >
                        Add Note
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Note</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={handleSubmitNote(handleAddNote)}
                        className="flex flex-col gap-4"
                      >
                        <div className="grid gap-3">
                          <Label htmlFor="edit-description">Note</Label>
                          <Textarea
                            id="edit-description"
                            placeholder="Enter your description"
                            {...registerNote("content", {
                              required: "Content is required",
                            })}
                          />
                          {errorsNote.content && (
                            <span className="text-destructive text-sm">
                              {errorsNote.content.message}
                            </span>
                          )}
                        </div>

                        <Button
                          type="submit"
                          disabled={isAddingNote}
                          className="w-full"
                        >
                          {isAddingNote ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            "Add Note"
                          )}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
                {!topic?.isCompleted && (
                  <Button
                    onClick={() => {
                      setLoadingId(topic._id);
                      markAsComplete(topic._id, {
                        onSuccess: () => {
                          setLoadingId(null);
                        },
                      });
                    }}
                    disabled={isMarkingAsComplete && loadingId === topic._id}
                  >
                    {isMarkingAsComplete && loadingId === topic._id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Marking...
                      </>
                    ) : (
                      "Mark as Complete"
                    )}
                  </Button>
                )}

                {/* EDIT Topic DIALOG - Only Name & Description */}
                <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedTopicId(topic._id)}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Topic</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={handleSubmitUpdate(handleEditTopic)}
                      className="flex flex-col gap-4"
                    >
                      <div className="grid gap-3">
                        <Label htmlFor="edit-title">Title</Label>
                        <Input
                          id="edit-title"
                          placeholder="Enter your title"
                          {...registerUpdate("name", {
                            required: "Name is required",
                          })}
                        />
                        {errorsUpdate.name && (
                          <span className="text-destructive text-sm">
                            {errorsUpdate.name.message}
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
                        disabled={isUpdatingTopic}
                        className="w-full"
                      >
                        {isUpdatingTopic ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Topic"
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* DELETE GOAL */}
                <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your topics from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        disabled={isDeletingTopic}
                        onClick={() =>
                          deleteTopic({ goalId: goalId, topicId: topic?._id })
                        }
                      >
                        {isDeletingTopic ? (
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
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[40vh]">
          <BookOpen className="h-8 w-8 text-muted-foreground bg-muted rounded-lg p-2 mb-2" />
          <p>No topics found</p>
          <p className="text-muted-foreground text-sm">
            Add some topics to get started
          </p>
        </div>
      )}
    </PageContainer>
  );
};

export default SingleGoalPage;
