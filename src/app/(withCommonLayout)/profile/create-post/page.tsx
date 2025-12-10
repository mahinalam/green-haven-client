/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { Button } from "@nextui-org/button";
import { zodResolver } from "@hookform/resolvers/zod";

import GTForm from "@/src/components/form/GTForm";
import GTInput from "@/src/components/form/GTInput";
import GTQuill from "@/src/components/form/GTQuill";
import GTSelect from "@/src/components/form/GTSelect";
import { useUser } from "@/src/context/user.provider";
import { useCreatePost } from "@/src/hooks/post.hook";
import { useGetAllCategories } from "@/src/hooks/category.hook";
import { createPostSchema } from "@/src/schemas/post.schema";
import { toast } from "sonner";
import { useGetSingleUser } from "@/src/hooks/auth.hook";
import CreatePostSkeleton from "@/src/components/loading-skeleton/CreatePostSkeleton";

interface FormValues {
  title: string;
  content: string;
  category: string;
  images: File[];
}

export default function CreatePost() {
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const queryClient = useQueryClient();

  const {
    mutate: handleCreatePost,
    isPending: createPostPending,
    isSuccess,
  } = useCreatePost();

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetAllCategories();

  const { user } = useUser();

  const { data: currentUserData } = useGetSingleUser(user?._id as string);

  if (categoriesLoading) {
    return <CreatePostSkeleton />;
  }

  const categories = categoriesData?.data.data?.map((category: any) => ({
    key: category?._id,
    label: category.name,
  }));

  const onSubmit: SubmitHandler<any> = (data) => {
    const id = toast.loading("Creating post...");
    const formData = new FormData();
    const postData = {
      user: user?._id,
      title: data.title,
      content: data.content,
      category: data.category,
      isPremium: data?.type !== "general",
    };

    formData.append("data", JSON.stringify(postData));
    for (const image of imageFiles) {
      formData.append("itemImages", image);
    }

    handleCreatePost(formData, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["POST"] });
        toast.success("Post created successfully", { id });
      },
      onError: () => {
        toast.error("Something went wrong!", { id });
      },
    });
  };

  const handleDeleteImage = (deletedImage: any) => {
    const updatedImage = imageFiles.filter(
      (image) => image.name !== deletedImage
    );
    setImageFiles(updatedImage);
  };

  const postTypeOption = [
    { key: "general", label: "General" },
    { key: "premium", label: "premium" },
  ];

  return (
    <div className="w-full lg:w-[60%] mx-auto mt-[64px] lg:mt-0">
      <div>
        <h1 className="font-semibold lg:text-2xl text-xl my-5 lg:my-10">
          Create Post
        </h1>
      </div>
      <GTForm onSubmit={onSubmit}>
        {/* Title Field */}

        <div>
          <label className="font-bold mb-3" htmlFor="title">
            Title
          </label>
          <div className="py-3">
            <GTInput id="title" label="Title" name="title" type="text" />
          </div>
        </div>

        {currentUserData?.data?.isVerified && postTypeOption?.length > 0 && (
          <div>
            <label className="font-bold mb-3" htmlFor="category">
              Type
            </label>
            <div className="py-3">
              <GTSelect label="Type" name="type" options={postTypeOption} />
            </div>
          </div>
        )}

        {/* Content Field */}
        <div>
          <label className="font-bold mb-3" htmlFor="category">
            Category
          </label>
          <div className="py-3">
            <GTSelect label="Category" name="category" options={categories} />
          </div>
        </div>
        <div className="py-3">
          <GTQuill
            label="Content"
            name="content"
            placeholder="Write your content here..."
          />
        </div>

        <div className="lg:pt-0 pt-5">
          <p className=" mt-12 font-bold mb-3">Upload Image</p>
          <label
            aria-label="Upload Your Files"
            className={
              "flex cursor-pointer hover:bg-athens-gray-50/10 items-center gap-3 rounded border border-dashed border-athens-gray-200 bg-white p-3 transition-all"
            }
            htmlFor="image"
          >
            <div className="flex size-16 items-center justify-center rounded-full bg-athens-gray-50">
              <svg
                className="lucide lucide-folder-open-dot size-5 text-athens-gray-500"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2" />
                <circle cx="14" cy="15" r="1" />
              </svg>
            </div>
            <div>
              <h5 className="font-semibold text-athens-gray-600">
                Upload Your Files
              </h5>
              <small className="text-sm text-athens-gray-400">
                Click to browse JPG,JPEG or PNG formats.
              </small>
            </div>
          </label>
          <input
            className="w-full  hidden mt-1 lg:mb-8 rounded-md border border-input bg-transparent py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm  h-12 items-center px-4 text-athens-gray-950 outline-none !ring-0 focus:ring-0"
            id="image"
            name="image"
            placeholder="Jhon Deo"
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) {
                setImageFiles((prevImages) => [...prevImages, file]);
              }
            }}
          />
          {imageFiles.map((imageFile, index: number) => (
            <div
              key={index}
              className="relative flex items-center gap-2 rounded-md border border-athens-gray-200 bg-white p-3"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-athens-gray-100">
                <svg
                  className="lucide lucide-image size-4 text-athens-gray-800"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </div>
              <div>
                <h6 className="!text-sm">{imageFile?.name}</h6>
                <p className="!text-xs !text-athens-gray-500">{`${
                  imageFile ? Number(imageFile?.size) / 1000 : 0.0
                } KB`}</p>
              </div>
              <div className="absolute inset-y-0 right-3 flex items-center">
                <button onClick={() => handleDeleteImage(imageFile.name)}>
                  <svg
                    className="lucide lucide-trash2 size-4 text-athens-gray-500 transition-all hover:text-athens-gray-800"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <Button
          fullWidth
          className=" border-[1px] bg-transparent  text-white hover:bg-green-700 
         border-white bg-green-600 mt-5"
          size="lg"
          spinner={
            <svg
              className="animate-spin h-5 w-5 text-current"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              />
            </svg>
          }
          type="submit"
        >
          Create Post
        </Button>
      </GTForm>
    </div>
  );
}
