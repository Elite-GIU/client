import React from 'react';
import { AnswerOption } from './AnswerOption';

interface QuizQuestionProps {
  questionText: string;
  answers: string[];
  currentQuestion: number;
  totalQuestions: number;
  progress: number;
  selectedAnswer?: string;
  onAnswerSelect: (answer: string) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  questionText,
  answers,
  currentQuestion,
  totalQuestions,
  progress,
  selectedAnswer,
  onAnswerSelect,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500">
            Question {currentQuestion} of {totalQuestions}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{questionText}</h2>
        <div className="space-y-3">
          {answers.map((answer, index) => (
            <AnswerOption
              key={index}
              text={answer}
              isSelected={selectedAnswer === answer}
              onClick={() => onAnswerSelect(answer)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};