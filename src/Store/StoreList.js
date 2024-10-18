import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainPage.css'; // CSS 파일 임포트

const StoreList = ({ stores }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = stores.slice(indexOfFirstRow, indexOfLastRow);
    const pageCount = Math.ceil(stores.length / rowsPerPage);

    const handlePageClick = (pageNum) => {
        setCurrentPage(pageNum);
    };

    return (
        <main style={{ textAlign: 'center', width: '800px', margin: '0 auto' }}>
            <h1>Store List</h1>
            <a href="/userHome">회원가입</a>
            <div className="container mt-3">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>상호명</th>
                            <th>지역명</th>
                            <th>카테고리</th>
                            <th>메뉴</th>
                            <th>가격</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((store) => (
                            <tr key={store.StoreNum} onClick={() => window.location.href = `/detail/${store.StoreNum}`}>
                                <td>{store.StoreNum}</td>
                                <td>{store.StoreName}</td>
                                <td>{store.AreaZ}</td>
                                <td>{store.Category}</td>
                                <td>{store.Menu}</td>
                                <td>{store.Price}원</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination d-flex justify-content-center">
                    {[...Array(pageCount)].map((_, index) => (
                        <button
                            key={index + 1}
                            className={`page-link btn btn-outline-info ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => handlePageClick(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default StoreList;
