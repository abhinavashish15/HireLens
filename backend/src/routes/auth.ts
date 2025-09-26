/** @format */

import express from "express";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { validate, registerSchema, loginSchema } from "@/middleware/validation";
import { authenticate } from "@/middleware/auth";

const router = express.Router();
 
// Generate JWT tokens
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  } as jwt.SignOptions);
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  validate(registerSchema),
  async (req, res): Promise<void> => {
    try {
      const { name, email, password, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
        return;
      }

      // Create new users
      
      const user = new User({
        name,
        email,
        passwordHash: password, // Will be hashed by pre-save middleware
        role: role || "candidate",
      });

      await user.save();

      // Generate token
      const token = generateToken((user._id as any).toString());

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error during registration",
      });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  validate(loginSchema),
  async (req, res): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
        return;
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
        return;
      }

      // Generate token
      const token = generateToken((user._id as any).toString());

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error during login",
      });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", authenticate, async (req, res): Promise<void> => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: (req as any).user!._id,
          name: (req as any).user!.name,
          email: (req as any).user!.email,
          role: (req as any).user!.role,
          createdAt: (req as any).user!.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
