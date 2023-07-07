export const handleNextPage = (setCurrentPage: React.Dispatch<React.SetStateAction<number>>, currentPage: number): void => {
  setCurrentPage(currentPage + 1);
};

export const handlePrevPage = (setCurrentPage: React.Dispatch<React.SetStateAction<number>>, currentPage: number): void => {
  setCurrentPage(currentPage - 1);
};
