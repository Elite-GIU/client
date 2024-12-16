import { ProgressBar } from "@/app/components/ProgressBar";
import * as React from "react";

interface Quiz {
    quizId: string;
    grade: number;
    courseName: string;
    moduleName: string;
    finalGrade: string
  }

export const QuizProgress: React.FC<Quiz> = ({
  quizId,
  grade, 
  courseName,
  moduleName,
  finalGrade
}) => {
  return (
    <>
        <div className="flex flex-col px-7 py-7 mb-0 w-full bg-white rounded-2xl border border-solid border-neutral-400 border-opacity-50 max-md:px-5 max-md:mb-2.5 max-md:max-w-full">
            <div className="flex flex-wrap gap-5 justify-between w-full font-medium leading-tight max-md:mr-2 max-md:max-w-full">
            <div className="flex gap-4">
                <div className="flex flex-col grow shrink-0 my-auto basis-0 w-fit">
                <div className="text-xl tracking-tight text-black">
                    {moduleName}
                </div>
                <div className="self-start mt-1.5 text-base tracking-tight text-neutral-500">
                    {courseName}
                </div>
                </div>
            </div>
            <div className="flex gap-6 self-start text-base tracking-tight">
                <div className="flex gap-1 text-black whitespace-nowrap">
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/c031591cb332f80591c3af779994fd716aa264f366815bc55a3b93c2500b12a3?placeholderIfAbsent=true&apiKey=243f119144084a878d11ef416bccfde3"
                    alt=""
                    className="object-contain shrink-0 w-5 aspect-square"
                />
                <div>{grade}%</div>
                </div>
                <button 
                className="my-auto text-sky-600 basis-auto"
                tabIndex={0}
                >
                View Details...
                </button>
            </div>
            </div>
            <ProgressBar percentage={grade} finalGrade={finalGrade} />

        </div>
    </>
  );
};