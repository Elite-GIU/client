'use client';
import * as React from "react";
import { CourseCardProps, MetricsDisplay } from "./MetricsDisplay";
import router from "next/router";
import Button from "@/app/components/Button";
import Link from "next/link";

export const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  studentCount,
  completedCount,
  averageGrade,
  averageRating,
  belowAverage,
  average,
  aboveAverage,
  excellent
}) => 
    
    {
        return (
            <div className="flex relative flex-wrap gap-6 items-start px-6 py-8 bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px] max-md:px-5">
              <div className="flex z-0 flex-col flex-1 shrink w-full basis-0 min-w-[160px] max-md:max-w-full">
                <div className="flex flex-col mt-4 w-full max-md:max-w-full">
                  <div className="tracking-tight leading-tight font-[number:var(--sds-typography-heading-font-weight)] text-black text-[length:var(--sds-typography-heading-size-base)] max-md:max-w-full">
                    {title}
                  </div>
                  <div className="mt-2 leading-snug font-[number:var(--sds-typography-body-font-weight-regular)] text-black text-[length:var(--sds-typography-body-size-medium)] max-md:max-w-full">
                    {description}
                  </div>
                  <MetricsDisplay
                    studentCount={studentCount}
                    completedCount={completedCount}
                    averageGrade={averageGrade}
                    averageRating={averageRating}
                    belowAverage={belowAverage}
                    average={average}
                    aboveAverage={aboveAverage}
                    excellent={excellent}
                  />
                </div>
              </div>
              
              <div className="absolute top-4 right-4 flex gap-2">
                <Link href={`/dashboard/analytics/${id}`}>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      View Module Analytics
                    </button>
                </Link>
                <Link href={`/dashboard/analytics/${id}/students`}>
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                      View & Add Students
                    </button>
                </Link>
              </div>
            </div>
          );
};