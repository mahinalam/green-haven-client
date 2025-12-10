"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useUser } from "@/src/context/user.provider";
import SuggesstedCard from "./SuggesstedCard";
import { logout } from "@/src/services/AuthService";
import { useRouter } from "next/navigation";
import { useGetAllPosts } from "@/src/hooks/post.hook";
import { IPost } from "@/src/types";
import { useGetSingleUser } from "@/src/hooks/auth.hook";
import { LuUserRound } from "react-icons/lu";
import { toast } from "sonner";

const RightSection = () => {
  const { user, setIsLoading, setUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: currentUserInfo } = useGetSingleUser(user?._id as string);
  const [page] = useState(1);
  const limit = 5;

  const {
    data: postsData,
    isLoading,
    isSuccess,
  } = useGetAllPosts({ page, limit });

  const handleLogout = async () => {
    setIsLoading(true);

    await logout();
    setUser(null);
    toast.success(`${user?.name} logged out successfully!`);
    router.push("/login");
  };
  return (
    <div className="relative ">
      {/* profile image section */}
      <Link
        href={
          user?.role === "USER"
            ? `/profile/${user?._id}`
            : "/profile/edit-profile"
        }
        className="inline-flex gap-2 items-center cursor-pointer"
      >
        <div className="">
          {currentUserInfo?.data?.profilePhoto ? (
            <div className="flex gap-2 items-start">
              <img
                alt=""
                className="size-[40px] rounded-full mr-2"
                src={currentUserInfo?.data?.profilePhoto}
              />
              <div>
                <p className="lg:text-sm hover:underline">
                  {currentUserInfo?.data?.email}
                </p>
                <p className="text-subTitle hover:underline">
                  {currentUserInfo?.data?.name}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 items-start animate-pulse">
              <div className="size-[40px] rounded-full bg-gray-300 mr-2" />
              <div className="space-y-2">
                <div className="h-3 w-32 bg-gray-300 rounded" />
                <div className="h-4 w-24 bg-gray-300 rounded" />
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* suggessted posts */}
      <div>
        <p className="lg:text-lg  border-b-4 border-b-border text-subTitle lg:mt-8 mb-5 pb-2">
          Recent Posts
        </p>
        {!isLoading &&
          isSuccess &&
          postsData?.data?.data?.slice(0, 5)?.map((post: IPost) => (
            <Link href={`/posts/${post._id}`} className="" key={post._id}>
              <SuggesstedCard title={post.title} />
            </Link>
          ))}
      </div>
    </div>
  );
};

export default RightSection;
