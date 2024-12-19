import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onPageClick: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onPageClick,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
        onClick={onPrevious}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          className={`px-4 py-2 rounded-lg ${
            currentPage === page
              ? 'bg-blue-600 text-white'
              : 'bg-white text-black'
          }`}
          onClick={() => onPageClick(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

