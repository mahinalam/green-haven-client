"use client";

import { Skeleton } from "@nextui-org/react";

export default function CreatePostSkeleton() {
  return (
    <div className="w-full lg:w-[60%] mx-auto mt-[64px] lg:mt-0 space-y-8">
      {/* Heading */}
      <Skeleton className="h-8 w-40 rounded-lg" />

      {/* Title */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-20 rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>

      {/* Type (conditional but shown in skeleton anyway) */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-20 rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>

      {/* Category */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>

      {/* Content Editor */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-40 w-full rounded-md" />
      </div>

      {/* Upload Image */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-20 w-full rounded-lg" />

        {/* Uploaded file preview skeleton */}
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>

      {/* Submit Button */}
      <Skeleton className="h-12 w-full rounded-md" />
    </div>
  );
}
