/** @format */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Video, Shield, Users, Clock } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const features = [
    {
      icon: Video,
      title: "Live Video Interviews",
      description: "Real-time video streaming with WebRTC technology",
    },
    {
      icon: Shield,
      title: "Advanced Proctoring",
      description:
        "AI-powered monitoring for tab switches, face detection, and audio monitoring",
    },
    {
      icon: Users,
      title: "Multi-role Support",
      description: "Support for candidates, interviewers, and administrators",
    },
    {
      icon: Clock,
      title: "Real-time Monitoring",
      description:
        "Live activity logs and instant alerts for suspicious behavior",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Video className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Video Proctoring
              </h1>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => router.push("/join")}>
                Join Interview
              </Button>
              <Button onClick={() => router.push("/login")}>
                Interviewer Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Secure Video Interview
            <span className="text-blue-600"> Proctoring</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Conduct secure, monitored video interviews with advanced AI-powered
            proctoring features. Detect suspicious activities in real-time and
            ensure interview integrity.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" onClick={() => router.push("/join")}>
              Join Interview
            </Button>
            <Button size="lg" onClick={() => router.push("/login")}>
              Interviewer Login
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="bg-blue-600 text-white">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of companies using our secure video proctoring
              platform
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push("/join")}
              >
                Join Interview
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push("/login")}
              >
                Interviewer Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Video Proctoring System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
