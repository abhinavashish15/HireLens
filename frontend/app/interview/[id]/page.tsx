/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Interview, Log, User } from "@/types";
import { interviewAPI } from "@/lib/api";
import Cookies from "js-cookie";
import VideoCall from "@/components/VideoCall";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  Clock,
  User as UserIcon,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface InterviewPageProps {
  params: {
    id: string;
  };
}

export default function InterviewPage({ params }: InterviewPageProps) {
  const router = useRouter();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [proctoringAlerts, setProctoringAlerts] = useState<any[]>([]);

  useEffect(() => {
    const loadInterview = async () => {
      try {
        const userData = Cookies.get("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }

        const [interviewResponse, logsResponse] = await Promise.all([
          interviewAPI.getInterview(params.id),
          interviewAPI.getInterviewLogs(params.id),
        ]);

        if (interviewResponse.success) {
          setInterview(interviewResponse.data.interview);
        }

        if (logsResponse.success) {
          setLogs(logsResponse.data.logs);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load interview");
      } finally {
        setIsLoading(false);
      }
    };

    loadInterview();
  }, [params.id]);

  const handleStartInterview = async () => {
    try {
      const response = await interviewAPI.startInterview(params.id);
      if (response.success) {
        setInterview(response.data.interview);
        setShowVideoCall(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to start interview");
    }
  };

  const handleProctoringAlert = (alert: any) => {
    setProctoringAlerts((prev) => [...prev, alert]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "ongoing":
        return <AlertTriangle className="h-5 w-5 text-green-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-yellow-100 text-yellow-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error || "Interview not found"}</p>
          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (showVideoCall) {
    return (
      <VideoCall
        interviewId={interview.id}
        userRole={user?.role || "candidate"}
        onProctoringAlert={handleProctoringAlert}
      />
    );
  }

  const candidate =
    typeof interview.candidateId === "object" ? interview.candidateId : null;
  const interviewer =
    typeof interview.interviewerId === "object"
      ? interview.interviewerId
      : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Interview Session
              </h1>
            </div>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interview Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon(interview.status)}
                  <span>Interview Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <p className="text-lg font-semibold capitalize">
                      {interview.status}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Scheduled Time
                    </label>
                    <p className="text-lg">
                      {new Date(interview.scheduledTime).toLocaleDateString()}{" "}
                      at{" "}
                      {new Date(interview.scheduledTime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {interview.title && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Interview Title
                    </label>
                    <p className="text-lg font-semibold">{interview.title}</p>
                  </div>
                )}

                {interview.duration && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Duration
                    </label>
                    <p className="text-lg">{interview.duration} minutes</p>
                  </div>
                )}

                {interview.inviteToken && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Session ID
                    </label>
                    <div className="flex items-center space-x-2">
                      <p className="text-lg font-mono bg-gray-100 px-3 py-2 rounded">
                        {interview.inviteToken}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigator.clipboard.writeText(interview.inviteToken)
                        }
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Candidate
                    </label>
                    {candidate ? (
                      <>
                        <p className="text-lg font-semibold">
                          {candidate.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {candidate.email}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg text-gray-500 italic">
                        No candidate joined yet
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Interviewer
                    </label>
                    <p className="text-lg font-semibold">
                      {interviewer?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {interviewer?.email}
                    </p>
                  </div>
                </div>

                {interview.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Notes
                    </label>
                    <p className="text-sm bg-gray-50 p-3 rounded">
                      {interview.notes}
                    </p>
                  </div>
                )}

                {interview.result && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Result
                    </label>
                    <div className="flex items-center space-x-2">
                      {interview.result === "pass" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="text-lg font-semibold capitalize">
                        {interview.result}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Proctoring Alerts */}
            {proctoringAlerts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span>Live Proctoring Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {proctoringAlerts.slice(-5).map((alert, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded"
                      >
                        <div>
                          <p className="font-medium text-red-800">
                            {alert.type}
                          </p>
                          <p className="text-sm text-red-600">
                            {alert.details}
                          </p>
                        </div>
                        <span className="text-xs text-red-500">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                {interview.status === "scheduled" && (
                  <Button
                    onClick={handleStartInterview}
                    className="w-full mb-4"
                  >
                    Start Interview
                  </Button>
                )}

                {interview.status === "ongoing" && (
                  <Button
                    onClick={() => setShowVideoCall(true)}
                    className="w-full mb-4"
                  >
                    Join Interview
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </Button>
              </CardContent>
            </Card>

            {/* Activity Logs */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>Recent proctoring events</CardDescription>
              </CardHeader>
              <CardContent>
                {logs.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No activity logs yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {logs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {log.type}
                          </p>
                          <p className="text-xs text-gray-600">{log.details}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(
                                log.severity
                              )}`}
                            >
                              {log.severity}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
