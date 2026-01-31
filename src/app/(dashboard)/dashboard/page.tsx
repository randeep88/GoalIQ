"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageContainer from "@/src/components/PageContainer";
import { Activity, Goal, Loader2, Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import useActivity from "@/src/hooks/useActivity";
import { format } from "date-fns";
import useGoals from "@/src/hooks/useGoals";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Topic = {
  name: string;
  description: string;
};

type Goal = {
  title: string;
  description: string;
  topics: Topic[];
};

const page = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const { activity } = useActivity();
  const { goals, loadingGoals, createGoal, isCreatingGoal } = useGoals();

  const activeGoals = goals?.filter(
    (g: any) => g.isStarted === true && g.progress < 100,
  );

  const completedGoals = goals?.filter((g: any) => g.progress === 100);
  const inProgressGoals = goals?.filter(
    (g: any) => g.progress > 0 && g.progress < 100,
  );
  const totalGoals = goals?.length;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Goal>({
    defaultValues: {
      topics: [{ name: "", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "topics",
  });

  const onsubmit = async (data: Goal) => {
    createGoal(data);
    setOpen(false);
  };

  return (
    <PageContainer>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-medium text-2xl">
              Welcome Back, {session?.user?.name}
            </h1>
            <p className="text-muted-foreground">
              Track your progress and stay consistent.
            </p>
          </div>
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
                        aria-invalid={errors.title ? true : false}
                        placeholder="Enter your title"
                        {...register("title", {
                          required: "Title is required",
                        })}
                      />
                      {errors.title && (
                        <span className="text-destructive">
                          {errors?.title?.message}
                        </span>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        aria-invalid={errors.description ? true : false}
                        placeholder="Enter your description"
                        {...register("description", {
                          required: "Description is required",
                        })}
                      />
                      {errors.description && (
                        <span className="text-destructive">
                          {errors?.description?.message}
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
                        <Card key={field.id} className="p-4 relative">
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

        <Card className="mt-6 border rounded-xl p-6 bg-accent/20 space-y-2">
          <div className="grid grid-cols-3 gap-6 h-30">
            <Card className="p-4 rounded-lg">
              <CardTitle className="font-medium text-lg">Total Goals</CardTitle>
              <CardContent className="text-4xl font-semibold">
                <div>
                  {!loadingGoals ? (
                    totalGoals
                  ) : (
                    <div className="flex items-center h-full mt-2">
                      <Loader2 className="animate-spin" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="p-4 rounded-lg">
              <CardTitle className="font-medium text-lg">
                Completed Goals
              </CardTitle>
              <CardContent className="text-4xl font-semibold">
                {!loadingGoals ? (
                  completedGoals?.length
                ) : (
                  <div className="flex items-center h-full mt-2">
                    <Loader2 className="animate-spin" />
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="p-4 rounded-lg">
              <CardTitle className="font-medium text-lg">
                In Progress Goals
              </CardTitle>
              <CardContent className="text-4xl font-semibold">
                {!loadingGoals ? (
                  inProgressGoals?.length
                ) : (
                  <div className="flex items-center h-full mt-2">
                    <Loader2 className="animate-spin" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Goal />
                  Active Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-2">
                {!loadingGoals ? (
                  <div>
                    {activeGoals?.length > 0 ? (
                      <ScrollArea className="h-60">
                        {activeGoals?.map((g: any, index: number) => (
                          <Item key={index} variant="muted" className="mb-2">
                            <ItemContent>
                              <ItemTitle>{g.title}</ItemTitle>
                              <ItemDescription>
                                {g.topics.length} topics
                              </ItemDescription>
                            </ItemContent>
                            <ItemActions>{g.progress}%</ItemActions>
                          </Item>
                        ))}
                      </ScrollArea>
                    ) : (
                      <div className="flex items-center justify-center h-60">
                        <p>No active goals</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-60">
                    <Loader2 className="animate-spin" />
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!loadingGoals ? (
                  <div>
                    {activity?.length > 0 ? (
                      <ScrollArea className="h-60">
                        {activity?.map((a: any, index: number) => (
                          <Item key={index} variant="muted" className="mb-2">
                            <ItemContent>
                              <ItemTitle>{a.type}</ItemTitle>
                              <ItemDescription>{a.message}</ItemDescription>
                            </ItemContent>
                            <ItemActions>
                              <div className="text-xs">
                                {format(new Date(a.createdAt), "dd, MMM yyyy")}
                              </div>
                            </ItemActions>
                          </Item>
                        ))}
                      </ScrollArea>
                    ) : (
                      <div className="flex items-center justify-center h-60">
                        <p>No recent activity</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-60">
                    <Loader2 className="animate-spin" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default page;
