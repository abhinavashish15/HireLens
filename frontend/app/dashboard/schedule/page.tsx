/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authAPI, interviewAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

const scheduleSchema = z.object({
  title: z.string().min(1, "Please enter a title for the interview"),
  scheduledTime: z.string().min(1, "Please select a date and time"),
  duration: z
    .number()
    .min(15, "Duration must be at least 15 minutes")
    .max(180, "Duration cannot exceed 180 minutes"),
});

type ScheduleForm = z.infer<typeof scheduleSchema>;

export default function ScheduleInterviewPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createdSession, setCreatedSession] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ScheduleForm>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      duration: 60,
    },
  });

  // No need to load candidates anymore

  const onSubmit = async (data: ScheduleForm) => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Create a session-based interview
      const response = await interviewAPI.schedule({
        title: data.title,
        scheduledTime: data.scheduledTime,
        duration: data.duration,
      });

      if (response.success) {
        setCreatedSession(response.data.interview);
        setSuccess("Interview session created successfully!");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to create interview session"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Minimum 30 minutes from now
    return now.toISOString().slice(0, 16);
  };

  // Show session creation success
  if (createdSession) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">
                  Interview Session Created
                </h1>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-600">
                <Calendar className="h-5 w-5" />
                <span>Session Created Successfully!</span>
              </CardTitle>
              <CardDescription>
                Share the session details with your candidate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Session Details */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-4">
                  Session Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-green-700">
                      Session ID
                    </label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Input
                        value={createdSession.inviteToken}
                        readOnly
                        className="font-mono text-lg bg-white"
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            createdSession.inviteToken
                          )
                        }
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-green-700">
                      Interview Title
                    </label>
                    <p className="text-green-800">{createdSession.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-green-700">
                      Scheduled Time
                    </label>
                    <p className="text-green-800">
                      {new Date(createdSession.scheduledTime).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-green-700">
                      Duration
                    </label>
                    <p className="text-green-800">
                      {createdSession.duration} minutes
                    </p>
                  </div>
                </div>
              </div>

              {/* Candidate Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">
                  Instructions for Candidate
                </h3>
                <p className="text-blue-700 text-sm mb-3">
                  Share this information with your candidate:
                </p>
                <div className="bg-white border border-blue-200 rounded p-3 text-sm">
                  <p className="font-medium mb-2">To join the interview:</p>
                  <ol className="list-decimal list-inside space-y-1 text-blue-800">
                    <li>
                      Go to:{" "}
                      <code className="bg-blue-100 px-1 rounded">
                        http://localhost:3000/join
                      </code>
                    </li>
                    <li>
                      Enter Session ID:{" "}
                      <code className="bg-blue-100 px-1 rounded">
                        {createdSession.inviteToken}
                      </code>
                    </li>
                    <li>Enter your full name</li>
                    <li>Click "Join Interview"</li>
                  </ol>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button asChild className="flex-1">
                  <Link href={`/interview/${createdSession.id}`}>
                    Start Interview Now
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                Schedule Interview
              </h1>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>New Interview</span>
            </CardTitle>
            <CardDescription>
              Schedule a new video interview with proctoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Interview Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Technical Interview - Frontend Developer"
                  {...register("title")}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Date & Time</Label>
                <Input
                  id="scheduledTime"
                  type="datetime-local"
                  min={getMinDateTime()}
                  {...register("scheduledTime")}
                  className={errors.scheduledTime ? "border-red-500" : ""}
                />
                {errors.scheduledTime && (
                  <p className="text-sm text-red-600">
                    {errors.scheduledTime.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Select a date and time at least 30 minutes from now
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  max="180"
                  {...register("duration", { valueAsNumber: true })}
                  className={errors.duration ? "border-red-500" : ""}
                />
                {errors.duration && (
                  <p className="text-sm text-red-600">
                    {errors.duration.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Interview duration between 15-180 minutes
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Proctoring Features
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Real-time video and audio monitoring</li>
                  <li>• Tab switch detection</li>
                  <li>• Multiple face detection</li>
                  <li>• Audio silence monitoring</li>
                  <li>• Window minimize detection</li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting
                    ? "Creating Session..."
                    : "Create Interview Session"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
