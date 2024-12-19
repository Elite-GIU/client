import { Card, Skeleton } from "@nextui-org/react";

export default function Loading(){
return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col">
        <main className="flex-1 bg-[#F5F5F5] p-6 sm:p-10">
          <div className="mb-6 sm:mb-8">
            <Skeleton className="rounded-lg">
              <div className="h-10 w-3/4 rounded-lg bg-default-300" /> {/* Title Skeleton */}
            </Skeleton>
            <Skeleton className="rounded-lg mt-2">
              <div className="h-6 w-2/3 rounded-lg bg-default-200" /> {/* Subtitle Skeleton */}
            </Skeleton>
          </div>

          <div className="text-black space-y-4 sm:space-y-6">
            {/* Simulate multiple loading ThreadCards */}
            {[...Array(3)].map((_, index) => (
              <Card
                key={index}
                className="w-full rounded-lg p-4 sm:p-6 bg-white shadow-md"
              >
                <Skeleton className="rounded-lg">
                  <div className="h-6 w-3/4 rounded-lg bg-default-300" /> {/* Thread Title */}
                </Skeleton>
                <Skeleton className="rounded-lg mt-2">
                  <div className="h-5 w-1/3 rounded-lg bg-default-200" /> {/* Author Name */}
                </Skeleton>
                <Skeleton className="rounded-lg mt-4">
                  <div className="h-20 rounded-lg bg-default-100" /> {/* Description */}
                </Skeleton>
                <Skeleton className="rounded-lg mt-2">
                  <div className="h-5 w-1/4 rounded-lg bg-default-200" /> {/* Replies Placeholder */}
                </Skeleton>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}