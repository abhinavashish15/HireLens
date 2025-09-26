/** @format */

import axios from "axios";
import Cookies from "js-cookie";
import { ApiResponse, AuthResponse, User, Interview, Log } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post("/api/auth/login", credentials);
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },
};

// Interview API
export const interviewAPI = {
  schedule: async (interviewData: {
    title: string;
    scheduledTime: string;
    duration: number;
  }): Promise<ApiResponse<{ interview: Interview }>> => {
    const response = await api.post("/api/interview/schedule", interviewData);
    return response.data;
  },

  getInterviews: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ interviews: Interview[]; pagination: any }>> => {
    const response = await api.get("/api/interview", { params });
    return response.data;
  },

  getInterview: async (
    id: string
  ): Promise<ApiResponse<{ interview: Interview }>> => {
    const response = await api.get(`/api/interview/${id}`);
    return response.data;
  },

  getInterviewByToken: async (
    token: string
  ): Promise<ApiResponse<{ interview: Interview }>> => {
    const response = await api.get(`/api/interview/token/${token}`);
    return response.data;
  },

  getInterviewLogs: async (
    id: string
  ): Promise<ApiResponse<{ logs: Log[] }>> => {
    const response = await api.get(`/api/interview/${id}/logs`);
    return response.data;
  },

  startInterview: async (
    id: string
  ): Promise<ApiResponse<{ interview: Interview }>> => {
    const response = await api.post(`/api/interview/${id}/start`);
    return response.data;
  },

  submitDecision: async (
    id: string,
    decision: {
      result: "pass" | "fail";
      notes?: string;
    }
  ): Promise<ApiResponse<{ interview: Interview }>> => {
    const response = await api.post(`/api/interview/${id}/decision`, decision);
    return response.data;
  },
};

// Utility functions
export const setAuthToken = (token: string) => {
  Cookies.set("token", token, { expires: 7 }); // 7 days
};

export const removeAuthToken = () => {
  Cookies.remove("token");
};

export const getAuthToken = () => {
  return Cookies.get("token");
};

export default api;
