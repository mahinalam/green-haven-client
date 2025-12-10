// import LeftSection from '@/src/components/sharred/LeftSection';
// import RightSection from '@/src/components/sharred/RightSection';
// import { Navbar } from '@/src/components/UI/Navbar';

// export default async function layout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div>
//       <div className="block lg:hidden">
//         <Navbar />
//       </div>
//       <div className=" flex p-5">
//         <div className="w-2/12 lg:block hidden">
//           <LeftSection />
//         </div>
//         <div className="lg:w-10/12 w-full lg:ml-auto">{children}</div>
//       </div>
//     </div>
//   );
// }

// ✅ app/layout.tsx (remains a Server Component)

import { Suspense } from "react";
import LeftSection from "@/src/components/sharred/LeftSection";
import { Navbar } from "@/src/components/UI/Navbar";
import SkeletonLoading from "@/src/components/UI/SkeletonLoading";
import LeftSectionSkeleton from "@/src/components/UI/LeftSkeleton";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:w-[90%] xl:w-[80%] w-full mx-auto">
      <div className="block lg:hidden">
        <Suspense fallback={<SkeletonLoading />}>
          <Navbar />
        </Suspense>
      </div>
      <div className="flex p-5">
        <div className="xl:w-2/12 lg:w-3/12 w-2/12 lg:block hidden">
          <Suspense fallback={<LeftSectionSkeleton />}>
            <LeftSection />
          </Suspense>
        </div>
        <div className="xl:w-10/12 lg:w-9/12 w-full lg:ml-auto  ">
          {children}
        </div>
      </div>
    </div>
  );
}
