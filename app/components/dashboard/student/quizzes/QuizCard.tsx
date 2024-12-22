import * as React from "react";

export interface QuizCardProps {
    title: string;
    questionCount: number;
    quizType: string;
    onStart: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  title,
  questionCount,
  quizType,
  onStart
}) => {
  return (
    <div className="flex flex-wrap gap-5 justify-between px-11 py-11 mb-0 max-w-full bg-white rounded-2xl shadow-[0px_1px_17px_rgba(0,0,0,0.25)] w-[1111px] max-md:px-5 max-md:mb-2.5">
      <div className="flex flex-col text-black">
        <div className="text-3xl tracking-tighter">{title}</div>
        <div className="self-start mt-4 text-sm tracking-tight">
          {questionCount} Questions • {quizType}
        </div>
      </div>
      <button 
        onClick={onStart}
        className="px-16 py-4 my-auto text-2xl tracking-tight text-white whitespace-nowrap bg-blue-300 rounded-2xl shadow-[0px_1px_17px_rgba(0,0,0,0.25)] max-md:px-5"
      >
        Start
      </button>
    </div>
  );
};