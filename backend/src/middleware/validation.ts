/** @format */

import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
      return;
    }

    next();
  };
};

// Validation schemas
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 50 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
  role: Joi.string()
    .valid("candidate", "interviewer", "admin")
    .default("candidate"),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

export const scheduleInterviewSchema = Joi.object({
  title: Joi.string().min(1).max(100).required().messages({
    "any.required": "Interview title is required",
    "string.min": "Title must be at least 1 character",
    "string.max": "Title cannot exceed 100 characters",
  }),
  scheduledTime: Joi.date().greater("now").required().messages({
    "date.greater": "Scheduled time must be in the future",
    "any.required": "Scheduled time is required",
  }),
  duration: Joi.number().min(15).max(180).required().messages({
    "any.required": "Duration is required",
    "number.min": "Duration must be at least 15 minutes",
    "number.max": "Duration cannot exceed 180 minutes",
  }),
});

export const interviewDecisionSchema = Joi.object({
  result: Joi.string().valid("pass", "fail").required().messages({
    "any.only": "Result must be either pass or fail",
    "any.required": "Result is required",
  }),
  notes: Joi.string().max(1000).optional().messages({
    "string.max": "Notes cannot exceed 1000 characters",
  }),
});
