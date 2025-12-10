"use client";
import React, { Suspense } from "react";
import ProfileVerificationFailed from "./VerifyFailedComponent";
import ProfileVerificationFailedSkeleton from "@/src/components/loading-skeleton/ProfileVerificationFailedSkeleton";

const FailedPage = () => {
  return (
    <Suspense fallback={<ProfileVerificationFailedSkeleton />}>
      <ProfileVerificationFailed />
    </Suspense>
  );
};

export default FailedPage;
