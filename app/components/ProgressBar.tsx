import * as React from "react";

interface ProgressBarProps {
  percentage: number;
  finalGrade: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, finalGrade }) => {
  return (
    <div className="flex flex-col items-start mt-2.5 bg-zinc-300 rounded-[100px] max-md:pr-5 max-md:max-w-full">
      <div 
        className="flex shrink-0 max-w-full bg-indigo-400 h-[11px] rounded-[100px]" 
        style={{ width: `${percentage}%` ,
        backgroundColor: finalGrade == "passed" ? '#6a4eff' : '#ff7f7f',
        }}
      />
    </div>
  );
};