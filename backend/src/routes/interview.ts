/** @format */

import express from "express";
import Interview from "../models/Interview";
import Log from "../models/Log";
import User from "../models/User";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import {
  validate,
  scheduleInterviewSchema,
  interviewDecisionSchema,
} from "../middleware/validation";

const router = express.Router();

// @route   POST /api/interview/schedule
// @desc    Schedule a new interview
// @access  Private (Interviewer/Admin only)
router.post(
  "/schedule",
  authenticate,
  authorize("interviewer", "admin"),
  validate(scheduleInterviewSchema),
  async (req: AuthRequest, res): Promise<void> => {
    try {
      const { title, scheduledTime, duration } = req.body;

      // Create session-based interview (no candidate required upfront)
      const interview = new Interview({
        title,
        interviewerId: req.user!._id,
        scheduledTime: new Date(scheduledTime),
        duration: duration,
        status: "scheduled",
      });

      await interview.save();

      // Populate the interview with interviewer details
      await interview.populate([
        { path: "interviewerId", select: "name email" },
      ]);

      res.status(201).json({
        success: true,
        message: "Interview session created successfully",
        data: {
          interview: {
            id: (interview._id as any).toString(),
            title: interview.title,
            interviewer: interview.interviewerId,
            status: interview.status,
            scheduledTime: interview.scheduledTime,
            duration: interview.duration,
            inviteToken: interview.inviteToken,
            createdAt: interview.createdAt,
          },
        },
      });
    } catch (error) {
      console.error("Schedule interview error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// @route   GET /api/interview
// @desc    Get interviews for current user
// @access  Private
router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query: any = {};

    if (req.user!.role === "candidate") {
      query.candidateId = req.user!._id;
    } else if (req.user!.role === "interviewer") {
      query.interviewerId = req.user!._id;
    }

    if (status) {
      query.status = status;
    }

    const interviews = await Interview.find(query)
      .populate("candidateId", "name email")
      .populate("interviewerId", "name email")
      .sort({ scheduledTime: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Interview.countDocuments(query);

    // Transform interviews to ensure IDs are strings
    const transformedInterviews = interviews.map((interview) => ({
      ...interview.toObject(),
      id: (interview._id as any).toString(),
    }));

    res.json({
      success: true,
      data: {
        interviews: transformedInterviews,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Get interviews error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// @route   GET /api/interview/token/:token
// @desc    Get interview details by invite token (for candidates)
// @access  Public
router.get("/token/:token", async (req, res): Promise<void> => {
  try {
    const { token } = req.params;

    const interview = await Interview.findOne({ inviteToken: token }).populate([
      { path: "candidateId", select: "name email" },
      { path: "interviewerId", select: "name email" },
    ]);

    if (!interview) {
      res.status(404).json({
        success: false,
        message: "Interview not found",
      });
      return;
    }

    res.json({
      success: true,
      data: {
        interview: {
          id: (interview._id as any).toString(),
          title: interview.title,
          candidate: interview.candidateId,
          interviewer: interview.interviewerId,
          status: interview.status,
          scheduledTime: interview.scheduledTime,
          duration: interview.duration,
          inviteToken: interview.inviteToken,
          createdAt: interview.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Get interview by token error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// @route   GET /api/interview/:id
// @desc    Get interview details
// @access  Private
router.get("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id || id === "undefined" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid interview ID",
      });
      return;
    }

    const interview = await Interview.findById(id)
      .populate("candidateId", "name email")
      .populate("interviewerId", "name email");

    console.log("Interview found:", !!interview, "ID:", id);

    if (!interview) {
      console.log("Interview not found for ID:", id);
      res.status(404).json({
        success: false,
        message: "Interview not found",
      });
      return;
    }

    // Check if user has access to this interview
    try {
      const hasAccess =
        req.user!.role === "admin" ||
        (interview.candidateId as any)?._id?.toString() ===
          (req as any).user!._id.toString() ||
        (interview.interviewerId as any)?._id?.toString() ===
          (req as any).user!._id.toString();

      if (!hasAccess) {
        res.status(403).json({
          success: false,
          message: "Access denied",
        });
        return;
      }
    } catch (accessError) {
      console.error("Error checking access:", accessError);
      res.status(500).json({
        success: false,
        message: "Error checking access",
      });
      return;
    }

    res.json({
      success: true,
      data: {
        interview: {
          ...interview.toObject(),
          id: (interview._id as any).toString(),
        },
      },
    });
  } catch (error) {
    console.error("Get interview error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// @route   GET /api/interview/token/:token
// @desc    Get interview by invite token
// @access  Public
router.get("/token/:token", async (req, res) => {
  try {
    const interview = await Interview.findOne({ inviteToken: req.params.token })
      .populate("candidateId", "name email")
      .populate("interviewerId", "name email");

    if (!interview) {
      res.status(404).json({
        success: false,
        message: "Invalid invite token",
      });
    }

    res.json({
      success: true,
      data: { interview },
    });
  } catch (error) {
    console.error("Get interview by token error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// @route   GET /api/interview/:id/logs
// @desc    Get interview logs
// @access  Private
router.get("/:id/logs", authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id || id === "undefined" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid interview ID",
      });
      return;
    }

    const interview = await Interview.findById(id);

    console.log("Interview found for logs:", !!interview, "ID:", id);

    if (!interview) {
      console.log("Interview not found for logs ID:", id);
      res.status(404).json({
        success: false,
        message: "Interview not found",
      });
      return;
    }

    // Check if user has access to this interview
    const hasAccess =
      req.user!.role === "admin" ||
      (interview.candidateId &&
        interview.candidateId.toString() ===
          (req as any).user!._id.toString()) ||
      interview.interviewerId.toString() === (req as any).user!._id.toString();

    if (!hasAccess) {
      res.status(403).json({
        success: false,
        message: "Access denied",
      });
      return;
    }

    const logs = await Log.find({ interviewId: interview._id }).sort({
      timestamp: -1,
    });

    res.json({
      success: true,
      data: { logs },
    });
  } catch (error) {
    console.error("Get interview logs error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// @route   POST /api/interview/:id/start
// @desc    Start interview
// @access  Private
router.post("/:id/start", authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id || id === "undefined" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid interview ID",
      });
      return;
    }

    const interview = await Interview.findById(id);

    if (!interview) {
      res.status(404).json({
        success: false,
        message: "Interview not found",
      });
      return;
    }

    // Check if user has access to start this interview
    const hasAccess =
      req.user!.role === "admin" ||
      (interview.candidateId &&
        interview.candidateId.toString() ===
          (req as any).user!._id.toString()) ||
      interview.interviewerId.toString() === (req as any).user!._id.toString();

    if (!hasAccess) {
      res.status(403).json({
        success: false,
        message: "Access denied",
      });
      return;
    }

    if (interview.status !== "scheduled") {
      res.status(400).json({
        success: false,
        message: "Interview is not in scheduled status",
      });
      return;
    }

    interview.status = "ongoing";
    interview.startedAt = new Date();
    await interview.save();

    res.json({
      success: true,
      message: "Interview started successfully",
      data: { interview },
    });
  } catch (error) {
    console.error("Start interview error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// @route   POST /api/interview/:id/decision
// @desc    Submit interview decision
// @access  Private (Interviewer/Admin only)
router.post(
  "/:id/decision",
  authenticate,
  authorize("interviewer", "admin"),
  validate(interviewDecisionSchema),
  async (req: AuthRequest, res): Promise<void> => {
    try {
      const { result, notes } = req.body;
      const { id } = req.params;

      // Validate ObjectId format
      if (!id || id === "undefined" || !/^[0-9a-fA-F]{24}$/.test(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid interview ID",
        });
        return;
      }

      const interview = await Interview.findById(id);

      if (!interview) {
        res.status(404).json({
          success: false,
          message: "Interview not found",
        });
      }

      // Check if interviewer has access to this interview
      const hasAccess =
        req.user!.role === "admin" ||
        (interview &&
          interview.interviewerId.toString() ===
            (req as any).user!._id.toString());

      if (!hasAccess) {
        res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      if (interview && interview.status !== "ongoing") {
        res.status(400).json({
          success: false,
          message: "Interview is not ongoing",
        });
        return;
      }

      if (interview) {
        interview.status = "completed";
        interview.completedAt = new Date();
        interview.result = result;
        interview.notes = notes;
        await interview.save();
      }

      res.json({
        success: true,
        message: "Interview decision submitted successfully",
        data: { interview },
      });
    } catch (error) {
      console.error("Submit decision error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

export default router;
