/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { interviewAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Video, User, Calendar, Clock, AlertCircle } from "lucide-react";

const joinSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  candidateName: z.string().min(2, "Name must be at least 2 characters"),
});

type JoinForm = z.infer<typeof joinSchema>;

export default function JoinInterviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [interview, setInterview] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<JoinForm>();

  // Pre-fill session ID from URL parameter
  useEffect(() => {
    const sessionId = searchParams.get("session");
    if (sessionId) {
      setValue("sessionId", sessionId);
      validateSession(sessionId);
    }
  }, [searchParams, setValue]);

  const validateSession = async (sessionId: string) => {
    setIsValidating(true);
    setError("");

    try {
      const response = await interviewAPI.getInterviewByToken(sessionId);
      if (response.success && response.data) {
        setInterview(response.data.interview);
      } else {
        setError("Invalid session ID or session not found");
      }
    } catch (err: any) {
      setError("Failed to validate session. Please check the session ID.");
    } finally {
      setIsValidating(false);
    }
  };

  const onSubmit = async (data: JoinForm) => {
    setIsLoading(true);
    setError("");

    try {
      // Validate session first
      const response = await interviewAPI.getInterviewByToken(data.sessionId);

      if (response.success && response.data) {
        const interview = response.data.interview;

        // Check if interview is in scheduled status
        if (interview.status !== "scheduled") {
          setError(
            "This interview is not available for joining at the moment."
          );
          return;
        }

        // Store candidate info in session storage for the interview
        sessionStorage.setItem(
          "candidateInfo",
          JSON.stringify({
            name: data.candidateName,
            sessionId: data.sessionId,
            interviewId: interview.id,
          })
        );

        // Redirect to interview room
        router.push(`/interview/${interview.id}?session=${data.sessionId}`);
      } else {
        setError("Invalid session ID or session not found");
      }
    } catch (err: any) {
      setError("Failed to join interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Video className="h-10 w-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Join Interview</h1>
          </div>
          <p className="text-gray-600">Enter your session details to join</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Join Interview Session</CardTitle>
            <CardDescription>
              Enter the session ID provided by your interviewer
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Interview Info Display */}
            {interview && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">
                  Interview Details
                </h3>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(interview.scheduledTime).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(interview.scheduledTime).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>
                      Interviewer: {interview.interviewerId?.name || "TBD"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="sessionId">Session ID</Label>
                <Input
                  id="sessionId"
                  placeholder="Enter session ID"
                  {...register("sessionId")}
                  className={errors.sessionId ? "border-red-500" : ""}
                  disabled={isValidating}
                />
                {errors.sessionId && (
                  <p className="text-sm text-red-600">
                    {errors.sessionId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="candidateName">Your Name</Label>
                <Input
                  id="candidateName"
                  placeholder="Enter your full name"
                  {...register("candidateName")}
                  className={errors.candidateName ? "border-red-500" : ""}
                />
                {errors.candidateName && (
                  <p className="text-sm text-red-600">
                    {errors.candidateName.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || isValidating}
              >
                {isValidating
                  ? "Validating Session..."
                  : isLoading
                  ? "Joining Interview..."
                  : "Join Interview"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have a session ID? Contact your interviewer.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
