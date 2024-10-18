import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyPage.css';
import { Link } from 'react-router-dom';

const MyReviews = () => {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [updatedContent, setUpdatedContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5; // 한 페이지에 5개의 리뷰 표시

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchReviews(parsedUser.userId, parsedUser.status);
    }
  }, []);

  const fetchReviews = async (userId, status) => {
    try {
      const response = await axios.get('http://localhost:8080/getReviewsByStatus', {
        params: { userId, status },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setReviews(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('리뷰 데이터를 가져오는 중 오류가 발생했습니다:', error);
      setReviews([]);
    }
  };

  const handleOpenModal = (review) => {
    setSelectedReview(review);
    setUpdatedContent(review.content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
    setUpdatedContent('');
  };

  const handleSaveChanges = async () => {
    if (!selectedReview) return;

    try {
      const response = await axios.post('http://localhost:8080/updateReview', {
        address: selectedReview.address,
        userId: selectedReview.userId,
        reviewNo: selectedReview.reviewNo,
        content: updatedContent,
        rating: selectedReview.rating
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.status === 200) {
        alert('리뷰 수정 성공');
        handleCloseModal();
        fetchReviews(user.userId, user.status);
      } else {
        alert(`리뷰 수정 실패: ${response.data}`);
      }
    } catch (error) {
      console.error('리뷰 수정 중 오류 발생:', error);
      alert(`리뷰 수정 실패: ${error.response?.data || error.message}`);
    }
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (!user) {
    return <p>로그인이 필요합니다.</p>;
  }

  return (
    <div>
      <h2 style={{color:'white'}}>내 리뷰 목록</h2>
      <table className="table table-dark table-hover">
        <thead>
          <tr>
            <th>가게 명</th>
            <th>카테고리</th>
            <th>리뷰 내용</th>
            <th>작성일</th>
            <th>수정</th>
          </tr>
        </thead>
        <tbody>
          {currentReviews.length > 0 ? (
            currentReviews.map((review, index) => (
              <tr key={`${review.reviewNo}-${index}`}>
                <td><Link to={`/detail/${review.title}`}style={{ color: 'white', textDecoration: 'none' }}>{review.title}</Link></td> 
                <td>{review.category}</td>
                <td>{user.status === "3" && `${review.userId}:`} {review.content}</td>
                <td>{new Date(review.modifiedDate).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleOpenModal(review)} className="btn btn-primary my-2">
                    수정
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                리뷰가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 페이지 네비게이션 */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'} m-1`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* 모달 창 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>리뷰 수정</h3>
            <textarea
              rows="5"
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
            />
            <button onClick={handleSaveChanges} className="btn btn-dark my-2">저장</button>
            <button onClick={handleCloseModal} className="btn btn-dark my-2">취소</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
