import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export interface CourseMetrics {
  studentCount: number;
  completedCount: number;
  averageGrade: number;
  averageRating: number;
  belowAverage: number;
  average: number;
  aboveAverage: number;
  excellent: number;
}
export interface CourseCardProps extends CourseMetrics {
  id: string;
  title: string;
  description: string;
}

export const MetricsDisplay: React.FC<CourseMetrics> = ({
  studentCount,
  completedCount,
  averageGrade,
  averageRating,
  belowAverage,
  average,
  aboveAverage,
  excellent,
}) => {
  interface GradeDistributionEntry {
    name: string;
    value: number;
    color: string;
  }

  const gradeDistribution: GradeDistributionEntry[] = [
    { name: "Below Avg", value: belowAverage, color: "#f87171" },
    { name: "Average", value: average, color: "#fbbf24" },
    { name: "Above Avg", value: aboveAverage, color: "#60a5fa" },
    { name: "Excellent", value: excellent, color: "#34d399" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
      {/* Metrics */}
      <div className="flex flex-col">
        <span className="text-sm text-gray-600">Enrolled Students</span>
        <span className="text-lg font-semibold text-black">{studentCount}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-600">Completed</span>
        <span className="text-lg font-semibold text-black">{completedCount}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-600">Avg. Grade</span>
        <span className="text-lg font-semibold text-black">{averageGrade}%</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-600">Rating</span>
        <span className="text-lg font-semibold text-black">
          {averageRating.toFixed(1)}/5.0
        </span>
      </div>

      {/* Grades Distribution Chart */}
      <div className="col-span-2">
        <span className="text-sm text-gray-600">Grades Distribution</span>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={gradeDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{
                backgroundColor: "#ffffff", 
                border: "1px solid #ddd",  
                color: "#000000",         
              }}
            />
            <Bar dataKey="value" radius={[5, 5, 0, 0]}>
              {gradeDistribution.map((entry: GradeDistributionEntry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

