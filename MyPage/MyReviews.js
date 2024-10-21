import React, { useState, useEffect } from 'react';  
import axios from 'axios';
import './MyPage.css';

const MyReviews = () => { 
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [updatedContent, setUpdatedContent] = useState('');   

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchReviews(parsedUser.userId);
    }
  }, []);

  const fetchReviews = async (userId) => {
    try {
      const response = await axios.get('http://localhost:8080/getReviewsByStatus', {
        params: { userId },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      console.log('Fetched reviews data:', response.data); // reviews 데이터 콘솔 출력

      setReviews(response.data);
      
      const fetchedData = response.data;
    
      console.log('Fetched reviews data:', fetchedData); // 콘솔 출력
      alert('Fetched reviews data: ' + JSON.stringify(fetchedData, null, 2)); // JSON 데이터를 문자열로 변환하여 alert로 출력
  
      setReviews(fetchedData);
    } catch (error) {
      console.error('리뷰 데이터를 가져오는 중 오류가 발생했습니다:', error);
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
      const response = await axios.post(`http://localhost:8080/updateReview`, {
        reviewNo: selectedReview.reviewNo,
        content: updatedContent,
        rating: selectedReview.rating,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.status === 200) {
        alert('리뷰 수정 성공');
        setIsModalOpen(false);
        fetchReviews(user.userId); 
      } else {
        alert(`리뷰 수정 실패: ${response.data}`);
      }
    } catch (error) {
      console.error('리뷰 수정 중 오류 발생:', error);
      alert(`리뷰 수정 실패: ${error.response?.data || error.message}`);
    }
  };
  
  if (!user) {
    return <p>로그인이 필요합니다.</p>;
  }

  return (
    <div> 
      <table className="table table-dark table-hover" >
        <thead>
          <tr>
            <th>가게명</th>
            <th>메뉴</th> 
            <th>리뷰 내용</th>
            <th>작성일</th>
            <th>수정</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={`${review.reviewNo}-${index}`}>
              <td>{review.title}</td>
              <td>{review.category}</td> 
              <td>{review.content}</td>
              <td>{new Date(review.createDate).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleOpenModal(review)}className="btn btn-primary my-2">수정</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.3)'
        }}>
          <h3 style={{color:'#000000'}}>리뷰 수정</h3>
          <textarea
            rows="5"
            style={{ width: '100%' }}
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
          />
          <button onClick={handleSaveChanges}className="btn btn-dark my-2"style={{margin:'10px'}}>저장</button>  
          <button onClick={handleCloseModal}className="btn btn-dark my-2">취소</button>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
