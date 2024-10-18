import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewSection = ({ address,title,category }) => {
  const [reviews, setReviews] = useState([]);
  const [newReviewContent, setNewReviewContent] = useState('');
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []); 

  // 새로운 리뷰 추가 함수
  const handleSubmit = async () => { 
    if (!newReviewContent) {
      setError("리뷰 내용을 입력하세요.");
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/addReview', { 
        address: address || "기본 주소", 
        userId: user.userId, 
        content: newReviewContent 
      });
  

      if (response.status === 200 || response.status === 201) {
        setReviews([...reviews, { userId: user.userId, title: title  , category: category  , content: newReviewContent, modifiedDate: new Date().toISOString(), hidden: false }]);
        setNewReviewContent('');
      }
    } catch (err) {
      setError("리뷰를 추가하는 중 오류가 발생했습니다.");
    }
  };


  // 리뷰 신고 함수

  const handleReport = async (index, reviewId) => {
    try {
      const response = await axios.post('http://localhost:8080/report', { reviewNo: reviewId });
      
      if (response.status === 200) {
        alert("리뷰가 신고되었습니다.");
        const updatedReviews = reviews.map((review, i) => 
          i === index ? { ...review, hidden: true } : review
        );
        setReviews(updatedReviews);
      }
    } catch (err) {
      alert("리뷰 신고 처리 중 오류가 발생했습니다.");
    }

  // 가게 주소에 따른 리뷰 가져오기
  useEffect(() => {
    // React에서 서버에 get 요청을 보낼 때 

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:8080/getReviews', {
        params: { address: address }
      });
      const reviewsWithHiddenFlag = response.data.map(review => ({ ...review, hidden: false }));
      setReviews(reviewsWithHiddenFlag);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("리뷰가 없습니다.");
      } else {
        setError("리뷰를 가져오는 중 오류가 발생했습니다.");
      }
    }
  }; 
    if (address) fetchReviews();  // address가 존재할 때만 리뷰 가져오기
  }, [address]);
//찜하기 만들기

  return (
    <div className="review-section" style={{ padding: '20px', margin: '20px 0' }}>
      {/* 로그인한 사용자만 리뷰 작성 가능 */}
      {user ? (
        <table className="table table-dark table-hover">

          <thead>
            <tr>
              <th colSpan='5'><h2>리뷰 작성</h2></th>
            </tr>
            <tr>
              <th colSpan='4'> 
                <textarea
                  value={newReviewContent}
                  onChange={(e) => setNewReviewContent(e.target.value)}
                  placeholder="오늘의 맛! 모두가 주목하는 당신의 한줄 평가!"
                  className="form-control"
                  rows="3"
                ></textarea> 
              </th>
              <th style={{ textAlign: 'center' }}>
                <button onClick={handleSubmit} className="btn btn-primary" style={{height:'80px'}}
                >리뷰 추가</button>

              </th>
            </tr>
          </thead>
        </table>
      ) : (
        <p style={{ textAlign: 'center', color: 'red' }}>리뷰를 작성하려면 로그인이 필요합니다.</p>
      )}

      {/* 모든 사용자가 리뷰 목록 볼 수 있음 */}

      <table className="table table-dark table-hover">
        <thead>
          <tr>
            <th colSpan='6'><h2>리뷰</h2></th>
          </tr>
          <tr>

            <th style={{textAlign : 'center', lineHeight : '50px', width:'15%'}}>가게 명</th>
            <th style={{textAlign : 'center', lineHeight : '50px', width:'15%'}}>카테고리</th> 
            <th style={{ textAlign: 'center', lineHeight: '50px', width: '40%' }}>리뷰 내용</th> 
            <th style={{textAlign : 'center', lineHeight : '50px', width:'15%'}}>작성일</th> 
            <th style={{textAlign : 'center', lineHeight : '50px', width:'15%'}}>작성자</th>  
          </tr>
        </thead>
        <tbody> 
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              !review.hidden && (

                <tr key={`${index}`}style={{textAlign : 'center', lineHeight : '50px'}}>
                  <td>{review.title || "N/A"}</td>
                  <td>{review.category || "N/A"}</td> 
                  <td style={{ width:'500px', wordBreak: 'break-word', whiteSpace: 'normal'}}>{review.content}</td>
                  <td>{new Date(review.modifiedDate).toLocaleDateString()}</td> 
                  <td>{review.userId || "익명"}
                    <button onClick={() => handleReport(index, review.reviewNo)} style={{float: 'right'}}
                      className=" btn btn-dark my-2">신고</button>
                  </td>
                </tr>
              )
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                리뷰가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>  
    </div>
  );
};

export default ReviewSection;
