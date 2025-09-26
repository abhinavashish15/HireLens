/** @format */

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { getAuthToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Phone,
  PhoneOff,
  AlertTriangle,
} from "lucide-react";

interface VideoCallProps {
  interviewId: string;
  userRole: "candidate" | "interviewer" | "admin";
  onProctoringAlert?: (alert: any) => void;
}

export default function VideoCall({
  interviewId,
  userRole,
  onProctoringAlert,
}: VideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [proctoringAlerts, setProctoringAlerts] = useState<any[]>([]);

  // WebRTC configuration
  const rtcConfig = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  // Initialize socket connection
  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
      {
        auth: { token },
      }
    );

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
      setConnectionStatus("Connected");

      // Join interview room
      socket.emit("join-interview", { interviewId });
    });

    socket.on("joined-interview", (data) => {
      console.log("Joined interview:", data);
      initializeWebRTC();
    });

    socket.on("user-joined", (data) => {
      console.log("User joined:", data);
      setConnectionStatus(`${data.userName} joined`);
    });

    socket.on("webrtc-signal", handleWebRTCSignal);
    socket.on("proctoring-alert", handleProctoringAlert);
    socket.on("error", (error) => {
      console.error("Socket error:", error);
      setConnectionStatus("Connection error");
    });

    return () => {
      socket.disconnect();
    };
  }, [interviewId]);

  // Initialize WebRTC
  const initializeWebRTC = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      peerConnectionRef.current = new RTCPeerConnection(rtcConfig);

      // Add local stream to peer connection
      stream.getTracks().forEach((track) => {
        peerConnectionRef.current?.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnectionRef.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit("webrtc-signal", {
            type: "ice-candidate",
            data: event.candidate,
          });
        }
      };

      // Start proctoring for candidates
      if (userRole === "candidate") {
        startProctoring(stream);
      }
    } catch (error) {
      console.error("Error initializing WebRTC:", error);
      setConnectionStatus("Failed to access camera/microphone");
    }
  };

  // Handle WebRTC signaling
  const handleWebRTCSignal = async (data: any) => {
    if (!peerConnectionRef.current) return;

    try {
      switch (data.type) {
        case "offer":
          await peerConnectionRef.current.setRemoteDescription(data.data);
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);

          socketRef.current?.emit("webrtc-signal", {
            type: "answer",
            data: answer,
          });
          break;

        case "answer":
          await peerConnectionRef.current.setRemoteDescription(data.data);
          break;

        case "ice-candidate":
          await peerConnectionRef.current.addIceCandidate(data.data);
          break;
      }
    } catch (error) {
      console.error("Error handling WebRTC signal:", error);
    }
  };

  // Handle proctoring alerts
  const handleProctoringAlert = (alert: any) => {
    setProctoringAlerts((prev) => [...prev, alert]);
    onProctoringAlert?.(alert);
  };

  // Start proctoring features
  const startProctoring = (stream: MediaStream) => {
    // Tab switch detection
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        socketRef.current?.emit("proctoring-event", {
          type: "tab-switch",
          details: "User switched to another tab",
          severity: "medium",
        });
      }
    });

    // Window minimize detection
    window.addEventListener("blur", () => {
      socketRef.current?.emit("proctoring-event", {
        type: "window-minimize",
        details: "User minimized the window",
        severity: "low",
      });
    });

    // Audio monitoring
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    microphone.connect(analyser);
    analyser.fftSize = 256;

    let silenceStart = Date.now();
    const silenceThreshold = 10000; // 10 seconds

    const checkAudio = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

      if (average < 10) {
        // Silent
        if (Date.now() - silenceStart > silenceThreshold) {
          socketRef.current?.emit("proctoring-event", {
            type: "mic-muted",
            details: "Microphone has been silent for more than 10 seconds",
            severity: "medium",
          });
        }
      } else {
        silenceStart = Date.now();
      }

      requestAnimationFrame(checkAudio);
    };

    checkAudio();
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);

        if (!videoTrack.enabled && userRole === "candidate") {
          socketRef.current?.emit("proctoring-event", {
            type: "video-disabled",
            details: "User disabled video",
            severity: "high",
          });
        }
      }
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  // End call
  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    window.close();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Interview Session</h2>
          <p className="text-sm text-gray-300">{connectionStatus}</p>
        </div>
        <div className="flex items-center space-x-2">
          {proctoringAlerts.length > 0 && (
            <div className="flex items-center space-x-1 text-yellow-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{proctoringAlerts.length} alerts</span>
            </div>
          )}
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 flex">
        {/* Remote Video */}
        <div className="flex-1 relative">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            Remote
          </div>
        </div>

        {/* Local Video */}
        <div className="w-80 relative">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            You
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4">
        <div className="flex justify-center space-x-4">
          <Button
            variant={isVideoEnabled ? "default" : "destructive"}
            onClick={toggleVideo}
            size="lg"
          >
            {isVideoEnabled ? (
              <Video className="h-5 w-5" />
            ) : (
              <VideoOff className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant={isAudioEnabled ? "default" : "destructive"}
            onClick={toggleAudio}
            size="lg"
          >
            {isAudioEnabled ? (
              <Mic className="h-5 w-5" />
            ) : (
              <MicOff className="h-5 w-5" />
            )}
          </Button>

          <Button variant="destructive" onClick={endCall} size="lg">
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Proctoring Alerts */}
      {proctoringAlerts.length > 0 && (
        <div className="bg-yellow-50 border-t border-yellow-200 p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">
            Proctoring Alerts
          </h3>
          <div className="space-y-2">
            {proctoringAlerts.slice(-3).map((alert, index) => (
              <div key={index} className="text-sm text-yellow-700">
                <strong>{alert.type}:</strong> {alert.details}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
