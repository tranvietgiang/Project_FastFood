export function Paginate({ currentPage, setCurrentPage, lastPage }) {
  const pageNext = () => {
    if (currentPage < lastPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const pagePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="flex space-x-3 mt-4">
        <button
          onClick={pagePrev}
          disabled={currentPage === 1}
          className={`px-3 py-1 border  ${
            currentPage === 1
              ? "bg-gray-200 hover:bg-gray-300"
              : "hover:bg-blue-500 bg-blue-600"
          }`}
        >
          Prev
        </button>

        <span className="px-3 py-1 border bg-red-500 text-white">
          {currentPage}
        </span>

        <button
          onClick={pageNext}
          disabled={currentPage === lastPage}
          className={`px-3 py-1 border  ${
            currentPage === lastPage
              ? "bg-gray-200 hover:bg-gray-300"
              : "hover:bg-blue-500 bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </>
  );
}
