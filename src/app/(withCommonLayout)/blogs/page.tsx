"use client";
import BlogCard from "@/src/components/dashboard/BlogCard";
import PostCard from "@/src/components/dashboard/PostCard";
import { useGetAllBlogs } from "@/src/hooks/blog.hook";
import { IBlog, ICategory } from "@/src/types";
import React, { useState } from "react";
import SingleBlogCard from "./SingleBlogCard";
import RightSection from "@/src/components/sharred/RightSection";
import BlogRightSection from "./BlogRightSection";
import PaginationHelper from "@/src/components/sharred/paginationHelper";
import { useGetAllCategories } from "@/src/hooks/category.hook";
import { Button } from "@nextui-org/button";
import BlogsPageSkeleton from "@/src/components/loading-skeleton/BlogsSkeleton";
import HomePageFullSkeleton from "@/src/components/loading-skeleton/HomeSkeleton";

const BlogsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 6;
  const [categoryValue, setCategoryValue] = useState("");
  const { data: blogs, isLoading } = useGetAllBlogs({
    page,
    limit,
    category: categoryValue,
  });
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetAllCategories();

  //   console.log("blogs", data);

  if (isLoading) {
    return <BlogsPageSkeleton />;
  }

  const totalProducts = blogs?.data?.meta?.total || 0;
  const totalPages = Math.ceil(totalProducts / limit);

  const handleCategoryValue = (categoryId: string) => {
    setCategoryValue(categoryId);
  };
  return (
    <div>
      <div className="flex gap-8 mt-[110px] lg:mt-0">
        <div className="lg:w-9/12 w-full">
          <p className="flex items-center justify-center  text-4xl md:text-5xl font-bold  lg:pb-4 pb-5">
            Blogs
          </p>

          {/* button */}
          <div className="inline-flex flex-wrap w-full mb-4 lg:gap-8 gap-4 lg:my-8 ">
            <Button
              className={
                !categoryValue
                  ? "bg-primary text-white hover:bg-green-700"
                  : "bg-gray-100 hover:bg-gray-200"
              }
              onClick={() => setCategoryValue("")}
            >
              All
            </Button>
            {categoriesData?.data?.data?.map(
              (item: ICategory, index: number) => (
                <Button
                  key={index}
                  className={
                    categoryValue === item._id
                      ? "bg-primary text-white hover:bg-green-700"
                      : "bg-gray-100 hover:bg-gray-200"
                  }
                  onClick={() => handleCategoryValue(item._id)}
                >
                  {" "}
                  {item.name}
                </Button>
              )
            )}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 grid-cols-1">
            {blogs?.data?.data?.map((blog: any, index: number) => (
              <SingleBlogCard key={index} post={blog} />
            ))}
          </div>
          <PaginationHelper
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
        <div className="lg:w-3/12 lg:block hidden">
          <BlogRightSection />
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
