import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../MyPage.css';
import { Link } from 'react-router-dom';

const MyReviews = () => {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [updatedContent, setUpdatedContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5; // 한 페이지에 5개의 리뷰 표시

  // 컴포넌트 로드 시 로컬 스토리지에서 사용자 정보 가져오기
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // 사용자 정보가 있을 경우 리뷰 가져오기
      handleReviewAction("getReviews", parsedUser.userId, parsedUser.status);
    }
  }, []);

  // 리뷰 조회 및 수정 API
  const handleReviewAction = async (action, userId, statusOrReviewData) => {
    try {
      const token = localStorage.getItem('token');  // 로컬 스토리지에서 토큰 가져오기

      let requestBody;

      // getReviews 요청일 경우
      if (action === "getReviews") {
        requestBody = {
          action: "getReviews",
          userId: userId,
          status: statusOrReviewData
        };
      } 
      // updateReview 요청일 경우
      else if (action === "updateReview") {
        requestBody = {
          action: "updateReview",
          reviewNo: statusOrReviewData.reviewNo,
          userId: statusOrReviewData.userId,
          address: statusOrReviewData.address,
          content: updatedContent,  // 수정된 리뷰 내용
          rating: statusOrReviewData.rating
        };
      }

      // 디버깅을 위한 콘솔 로그 추가
      console.log("Request Body: ", requestBody);
      console.log("Token: ", token);

      // 서버로 요청 보내기 (토큰 포함)
      const response = await axios.post('http://localhost:8080/mypage/reviewAction', requestBody, {
        headers: { Authorization: `Bearer ${token}` }  // 토큰을 헤더에 추가
      });

      // getReviews 요청에 대한 처리
      if (action === "getReviews") {
        setReviews(Array.isArray(response.data) ? response.data : []);
      } 
      // updateReview 요청에 대한 처리
      else if (action === "updateReview") {
        alert('리뷰 수정 성공');
        setIsModalOpen(false);
        handleReviewAction("getReviews", user.userId, user.status); // 수정 후 리뷰 목록 다시 불러오기
      }
    } catch (error) {
      // 오류 발생 시 처리
      console.error('리뷰 데이터를 가져오는 중 오류가 발생했습니다:', error);
      if (action === "getReviews") {
        setReviews([]);  // 오류 시 빈 배열로 설정
      } else {
        alert('리뷰 수정 실패');
      }
    }
  };

  // 모달 열기
  const handleOpenModal = (review) => {
    setSelectedReview(review);
    setUpdatedContent(review.content);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
    setUpdatedContent('');
  };

  // 모달 외부 클릭 시 닫기
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // 리뷰 수정 저장
  const handleSaveChanges = () => {
    if (!selectedReview) return;
    handleReviewAction("updateReview", null, selectedReview); // 리뷰 수정 요청
  };

  // 페이징 처리
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
    <div className="container1">
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
                <td><Link to={`/detail/${review.areaNm}/${review.title}`}style={{ color: 'white', textDecoration: 'none' }}>{review.title}</Link></td>
                <td>{review.category}</td>
                <td>{user.status === "3" && `${review.userId}:`} {review.content}</td>
                <td>{new Date(review.modifiedDate).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleOpenModal(review)} className="btn btn-primary my-2">수정</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>리뷰가 없습니다.</td>
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
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content1" onClick={(e) => e.stopPropagation()}>
            <h3>리뷰 수정</h3>
            <textarea
              style={{width:'460px'}}
              rows="5"
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
            /><br/>
            <div style={{ display: 'flex', justifyContent: 'center'}}>
              <button style={{marginRight:'10px',width:'250px'}} onClick={handleSaveChanges} className="btn btn-light my-2">저장</button>
              <button style={{width:'250px'}}onClick={handleCloseModal} className="btn btn-light my-2">취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
