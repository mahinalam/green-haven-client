"use client";
import React, { Suspense } from "react";
import ProfileVerificationFailedSkeleton from "@/src/components/loading-skeleton/ProfileVerificationFailedSkeleton";
import ProfileVerificationSuccess from "./VerifySuccessComponent";

const SuccessPage = () => {
  return (
    <Suspense fallback={<ProfileVerificationFailedSkeleton />}>
      <ProfileVerificationSuccess />
    </Suspense>
  );
};

export default SuccessPage;
