/** @format */

export interface User {
  id: string;
  name: string;
  email: string;
  role: "candidate" | "interviewer" | "admin";
  createdAt: string;
}

export interface Interview {
  id: string;
  candidateId?: string | User;
  interviewerId: string | User;
  title: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  scheduledTime: string;
  duration: number;
  startedAt?: string;
  completedAt?: string;
  result?: "pass" | "fail";
  notes?: string;
  logs: string[];
  inviteToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface Log {
  id: string;
  interviewId: string;
  type:
    | "tab-switch"
    | "multiple-face"
    | "mic-muted"
    | "window-minimize"
    | "audio-detected"
    | "video-disabled";
  timestamp: string;
  details: string;
  severity: "low" | "medium" | "high";
  resolved: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  details?: string[];
}

export interface WebRTCMessage {
  type: "offer" | "answer" | "ice-candidate" | "proctoring-event";
  data: any;
  targetUserId?: string;
  fromUserId?: string;
}

export interface ProctoringEvent {
  type: string;
  details: string;
  severity?: "low" | "medium" | "high";
  timestamp: Date;
  candidateName: string;
}

export interface SocketEvents {
  "join-interview": (data: { interviewId: string }) => void;
  "joined-interview": (data: { interviewId: string }) => void;
  "user-joined": (data: {
    userId: string;
    userName: string;
    userRole: string;
  }) => void;
  "user-left": (data: { userId: string; userName: string }) => void;
  "webrtc-signal": (data: WebRTCMessage) => void;
  "proctoring-event": (data: {
    type: string;
    details: string;
    severity?: string;
  }) => void;
  "proctoring-alert": (data: ProctoringEvent) => void;
  error: (data: { message: string }) => void;
}
