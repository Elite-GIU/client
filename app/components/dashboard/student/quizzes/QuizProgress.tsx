import * as React from "react";
import { useRouter } from 'next/navigation';

interface Quiz {
    quizId: string;
    grade: number;
    courseName: string;
    moduleName: string;
    finalGrade: string;
  }

export const QuizProgress: React.FC<Quiz> = ({
  quizId,
  grade, 
  courseName,
  moduleName,
  finalGrade
}) => {
  const router = useRouter();
  return (
    <>
        <div className="border border-gray-200 rounded-lg p-6 mx-auto">
            <div className="flex justify-between items-center">
            <div className="flex gap-4">
                <div className="flex flex-col grow shrink-0 my-auto basis-0 w-fit">
                
                <div className="text-xl font-medium text-black">
                    {moduleName}
                </div>
                <div className="text-base text-sm text-gray-500">
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
                onClick={() => router.push(`/dashboard/quizzes/${quizId}`)}
                >
                View Details...
                </button>
            </div>
            </div>
            {/* <ProgressBar percentage={grade} finalGrade={finalGrade} /> */}
            <div className="w-full bg-gray-200 h-2 rounded-lg mt-4">
            <div
                className="h-2 rounded-lg"
                style={{
                width: `${grade}%`,
                backgroundColor: finalGrade === `passed` ? '#6a4eff' : '#ff7f7f',
                }}
            ></div>
            </div>
        </div>
    </>
  );
};