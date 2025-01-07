import React from "react";
import "./pagination.css"; // 分頁的樣式

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(
                    <button
                        key={i}
                        className={`pagination-button ${currentPage === i ? "active" : ""}`}
                        onClick={() => onPageChange(i)}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(
                        <button
                            key={i}
                            className={`pagination-button ${currentPage === i ? "active" : ""}`}
                            onClick={() => onPageChange(i)}
                        >
                            {i}
                        </button>
                    );
                }
                pages.push(<span key="ellipsis-end" className="pagination-ellipsis">...</span>);
                pages.push(
                    <button
                        key={totalPages}
                        className="pagination-button"
                        onClick={() => onPageChange(totalPages)}
                    >
                        {totalPages}
                    </button>
                );
            } else if (currentPage > totalPages - 3) {
                pages.push(
                    <button
                        key={1}
                        className="pagination-button"
                        onClick={() => onPageChange(1)}
                    >
                        1
                    </button>
                );
                pages.push(<span key="ellipsis-start" className="pagination-ellipsis">...</span>);
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(
                        <button
                            key={i}
                            className={`pagination-button ${currentPage === i ? "active" : ""}`}
                            onClick={() => onPageChange(i)}
                        >
                            {i}
                        </button>
                    );
                }
            } else {
                pages.push(
                    <button
                        key={1}
                        className="pagination-button"
                        onClick={() => onPageChange(1)}
                    >
                        1
                    </button>
                );
                pages.push(<span key="ellipsis-start" className="pagination-ellipsis">...</span>);
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(
                        <button
                            key={i}
                            className={`pagination-button ${currentPage === i ? "active" : ""}`}
                            onClick={() => onPageChange(i)}
                        >
                            {i}
                        </button>
                    );
                }
                pages.push(<span key="ellipsis-end" className="pagination-ellipsis">...</span>);
                pages.push(
                    <button
                        key={totalPages}
                        className="pagination-button"
                        onClick={() => onPageChange(totalPages)}
                    >
                        {totalPages}
                    </button>
                );
            }
        }

        return pages;
    };

    return (
        <div className="pagination-container">
            <button
                className="pagination-arrow-button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &lt;
            </button>
            {renderPagination()}
            <button
                className="pagination-arrow-button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>
        </div>
    );
};

export default Pagination;
