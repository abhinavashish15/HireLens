/** @format */

import mongoose, { Document, Schema } from "mongoose";

export interface ILog extends Document {
  interviewId: mongoose.Types.ObjectId;
  type:
    | "tab-switch"
    | "multiple-face"
    | "mic-muted"
    | "window-minimize"
    | "audio-detected"
    | "video-disabled";
  timestamp: Date;
  details: string;
  severity: "low" | "medium" | "high";
  resolved: boolean;
  createdAt: Date;
}

const LogSchema = new Schema<ILog>(
  {
    interviewId: {
      type: Schema.Types.ObjectId,
      ref: "Interview",
      required: [true, "Interview ID is required"],
    },
    type: {
      type: String,
      enum: [
        "tab-switch",
        "multiple-face",
        "mic-muted",
        "window-minimize",
        "audio-detected",
        "video-disabled",
      ],
      required: [true, "Log type is required"],
    },
    timestamp: {
      type: Date,
      required: [true, "Timestamp is required"],
      default: Date.now,
    },
    details: {
      type: String,
      required: [true, "Details are required"],
      maxlength: [500, "Details cannot exceed 500 characters"],
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Severity is required"],
      default: "medium",
    },
    resolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
LogSchema.index({ interviewId: 1, timestamp: -1 });
LogSchema.index({ type: 1, severity: 1 });
LogSchema.index({ timestamp: -1 });

export default mongoose.model<ILog>("Log", LogSchema);
