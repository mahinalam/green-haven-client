"use server";

import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import axiosInstance from "@/src/lib/AxiosInstance";

// get single user
export const getSingleUser = async (userId: string) => {
  try {
    const { data } = await axiosInstance.get(`/users/single-user/${userId}`);
    return data;
  } catch (error: any) {
    throw error;
  }
};

// get all users
export const getAllUsers = async (params?: { [key: string]: any }) => {
  const searchParams = new URLSearchParams(params).toString();
  try {
    const { data } = await axiosInstance.get(`/users?${searchParams}`);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const registerUser = async (formData: FormData): Promise<any> => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/register`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (data.success) {
      cookies().set("accessToken", data?.data?.accessToken);
      cookies().set("refreshToken", data?.data?.refreshToken);
    }

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const loginUser = async (userData: FieldValues) => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/login`,
      userData
    );

    if (data.success) {
      cookies().set("accessToken", data?.data?.accessToken);
      cookies().set("refreshToken", data?.data?.refreshToken);
    }

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const logout = async () => {
  cookies().delete("accessToken");
  cookies().delete("refreshToken");
};

export const verifyProfile = async (): Promise<any> => {
  try {
    const { data } = await axiosInstance.post("/payment/verify-profile");

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const followUser = async (
  userIds: Record<string, unknown>
): Promise<any> => {
  try {
    const { data } = await axiosInstance.put("/users/follow-users", userIds);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

// unfollw user
export const unFollowUser = async (
  userIds: Record<string, unknown>
): Promise<any> => {
  try {
    const { data } = await axiosInstance.put("/users/unfollow-users", userIds);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const checkFollower = async (ids: Record<string, unknown>) => {
  try {
    const { data } = await axios.post(
      "http://localhost:5000/users/check-follower",
      ids
    );

    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const deleteUser = async (userId: string): Promise<any> => {
  try {
    const { data } = await axiosInstance.delete(`/users/${userId}`);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getCurrentUser = () => {
  const accessToken = cookies().get("accessToken")?.value;

  if (!accessToken) return null;

  try {
    const decodedToken: any = jwtDecode(accessToken); // jwtDecode is synchronous
    return {
      _id: decodedToken._id,
      name: decodedToken.name,
      email: decodedToken.email,
      mobileNumber: decodedToken.mobileNumber,
      role: decodedToken.role,
      profilePhoto: decodedToken.profilePhoto,
      isVerified: decodedToken.isVerified,
    };
  } catch (err) {
    return null;
  }
};

export const getNewAccessToken = async () => {
  try {
    const refreshToken = cookies().get("refreshToken")?.value;

    const res = await axiosInstance({
      url: "/auth/refresh-token",
      method: "POST",
      withCredentials: true,
      headers: {
        cookie: `refreshToken=${refreshToken}`,
      },
    });

    return res.data;
  } catch (error: any) {
    throw new Error("Failed to get new access token");
  }
};

export const updateMyProfile = async (formData: FormData): Promise<any> => {
  try {
    const { data } = await axiosInstance.put("/users/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

// get user stats
export const getUserStats = async () => {
  try {
    const { data } = await axiosInstance.get("/users/user-stats");
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const createTopGardener = async (payload: {
  user: string;
}): Promise<any> => {
  try {
    const { data } = await axiosInstance.post("/users/top-gardeners", payload);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
// remove top gardener
export const removeTopGardener = async (userId: string): Promise<any> => {
  try {
    const { data } = await axiosInstance.delete(
      `/users/top-gardeners/${userId}`
    );

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
