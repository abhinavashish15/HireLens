/** @format */

import { Server as SocketIOServer, Socket as SocketIOSocket } from "socket.io";
import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import Interview from "@/models/Interview";
import Log from "@/models/Log";

interface AuthenticatedSocket extends SocketIOSocket {
  user?: any;
  interviewId?: string;
}

interface WebRTCMessage {
  type: "offer" | "answer" | "ice-candidate" | "proctoring-event";
  data: any;
  targetUserId?: string;
}

export const setupSocketIO = (server: HTTPServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Authentication middleware for Socket.io
  io.use(async (socket: SocketIOSocket, next) => {
    try {
      const token = (socket as any).handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };
      const user = await User.findById(decoded.userId).select("-passwordHash");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      (socket as any).user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket: SocketIOSocket) => {
    console.log(
      `User ${(socket as any).user.name} connected with socket ${socket.id}`
    );

    // Join interview room
    socket.on("join-interview", async (data: { interviewId: string }) => {
      try {
        const { interviewId } = data;

        // Verify user has access to this interview
        const interview = await Interview.findById(interviewId);
        if (!interview) {
          (socket as any).emit("error", { message: "Interview not found" });
          return;
        }

        const hasAccess =
          (socket as any).user.role === "admin" ||
          (interview.candidateId &&
            interview.candidateId.toString() ===
              (socket as any).user._id.toString()) ||
          interview.interviewerId.toString() ===
            (socket as any).user._id.toString();

        if (!hasAccess) {
          (socket as any).emit("error", {
            message: "Access denied to this interview",
          });
          return;
        }

        (socket as any).join(interviewId);
        (socket as any).interviewId = interviewId;

        // Notify others in the room
        (socket as any).to(interviewId).emit("user-joined", {
          userId: (socket as any).user._id,
          userName: (socket as any).user.name,
          userRole: (socket as any).user.role,
        });

        (socket as any).emit("joined-interview", { interviewId });
        console.log(
          `User ${(socket as any).user.name} joined interview ${interviewId}`
        );
      } catch (error) {
        console.error("Join interview error:", error);
        (socket as any).emit("error", { message: "Failed to join interview" });
      }
    });

    // Handle WebRTC signaling
    socket.on("webrtc-signal", async (data: WebRTCMessage) => {
      try {
        if (!(socket as any).interviewId) {
          (socket as any).emit("error", {
            message: "Not in an interview room",
          });
          return;
        }

        // Forward the signal to other participants in the room
        (socket as any).to((socket as any).interviewId).emit("webrtc-signal", {
          ...data,
          fromUserId: (socket as any).user._id,
        });
      } catch (error) {
        console.error("WebRTC signal error:", error);
        (socket as any).emit("error", {
          message: "Failed to send WebRTC signal",
        });
      }
    });

    // Handle proctoring events
    socket.on(
      "proctoring-event",
      async (data: { type: string; details: string; severity?: string }) => {
        try {
          if (!(socket as any).interviewId) {
            return;
          }

          // Only candidates can trigger proctoring events
          if ((socket as any).user.role !== "candidate") {
            return;
          }

          const log = new Log({
            interviewId: (socket as any).interviewId,
            type: data.type as any,
            details: data.details,
            severity: data.severity || "medium",
          });

          await log.save();

          // Update interview with new log
          await Interview.findByIdAndUpdate((socket as any).interviewId, {
            $push: { logs: log._id },
          });

          // Notify interviewer about the event
          (socket as any)
            .to((socket as any).interviewId)
            .emit("proctoring-alert", {
              type: data.type,
              details: data.details,
              severity: data.severity || "medium",
              timestamp: new Date(),
              candidateName: (socket as any).user.name,
            });

          console.log(
            `Proctoring event logged: ${data.type} for interview ${
              (socket as any).interviewId
            }`
          );
        } catch (error) {
          console.error("Proctoring event error:", error);
        }
      }
    );

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User ${(socket as any).user?.name} disconnected`);

      if ((socket as any).interviewId) {
        (socket as any).to((socket as any).interviewId).emit("user-left", {
          userId: (socket as any).user._id,
          userName: (socket as any).user.name,
        });
      }
    });
  });

  return io;
};
