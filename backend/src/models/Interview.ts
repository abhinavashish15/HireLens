/** @format */

import mongoose, { Document, Schema } from "mongoose";

export interface IInterview extends Document {
  candidateId?: mongoose.Types.ObjectId;
  interviewerId: mongoose.Types.ObjectId;
  title: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  scheduledTime: Date;
  duration: number;
  startedAt?: Date;
  completedAt?: Date;
  result?: "pass" | "fail";
  notes?: string;
  logs: mongoose.Types.ObjectId[];
  inviteToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for session-based interviews
    },
    interviewerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Interviewer ID is required"],
    },
    title: {
      type: String,
      required: [true, "Interview title is required"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled"],
      required: [true, "Status is required"],
      default: "scheduled",
    },
    scheduledTime: {
      type: Date,
      required: [true, "Scheduled time is required"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [15, "Duration must be at least 15 minutes"],
      max: [180, "Duration cannot exceed 180 minutes"],
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    result: {
      type: String,
      enum: ["pass", "fail"],
    },
    notes: {
      type: String,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    logs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Log",
      },
    ],
    inviteToken: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate invite token before validation
InterviewSchema.pre("validate", function (next) {
  if (!this.inviteToken) {
    this.inviteToken = require("crypto").randomBytes(32).toString("hex");
  }
  next();
});

// Index for better query performance
InterviewSchema.index({ candidateId: 1, status: 1 });
InterviewSchema.index({ interviewerId: 1, status: 1 });
InterviewSchema.index({ inviteToken: 1 });

export default mongoose.model<IInterview>("Interview", InterviewSchema);
