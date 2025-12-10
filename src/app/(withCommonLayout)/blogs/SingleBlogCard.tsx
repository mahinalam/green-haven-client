"use client";
import { IBlog } from "@/src/types";
import React from "react";
import Link from "next/link";
import moment from "moment";

const SingleBlogCard = ({ post }: { post: IBlog }) => {
  const { _id, images, title, content, author, status, createdAt } = post;

  return (
    <>
      <div className="group border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white   hover:scale-[1.01]">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <img
              src={author?.profilePhoto || "/default-avatar.png"}
              alt={author?.name || "User"}
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div className="text-sm">
              <p className="font-semibold text-gray-800">{author?.name}</p>
              <p className="text-gray-500 text-xs">
                {moment(createdAt).fromNow()}
              </p>
              <p
                className={`text-xs font-medium ${
                  status === "approved" ? "text-primary" : "text-red-600"
                } `}
              >
                {status}
              </p>
            </div>
          </div>
        </div>

        {/* Image */}
        {images?.length > 0 && (
          <Link href={`/blogs/${_id}`}>
            <div className="w-full h-[250px] md:h-[300px] overflow-hidden">
              <img
                src={images[0]}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </Link>
        )}

        {/* Content */}
        <Link href={`/blogs/${_id}`}>
          <div className="p-4 space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <div
              className="text-sm text-gray-600 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </Link>
      </div>
    </>
  );
};

export default SingleBlogCard;
