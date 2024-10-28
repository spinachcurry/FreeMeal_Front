import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, forwardRef } from 'react'; 
import axios from 'axios';

const ReviewSection = forwardRef(({ address, title, category }, ref) => {
  const [reviews, setReviews] = useState([]);
  const [newReviewContent, setNewReviewContent] = useState('');
  const [error, setError] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const handleRequest = async (action, data = {}) => {
    try {
      const response = await axios.post('http://localhost:8080/mypage/reviewAction', { action, ...data });
      return response.data;
    } catch (err) {
      setError('오류가 발생했습니다.');
    }
  };

  const handleSubmit = async () => {
    if (!newReviewContent) return setError("리뷰 내용을 입력하세요.");
    const newReview = { userId: user.userId, address, content: newReviewContent };
    const result = await handleRequest('addReview', newReview);
    if (result) {
      setReviews([...reviews, { ...newReview, title, category, modifiedDate: new Date().toISOString(), hidden: false }]);
      setNewReviewContent('');
    }
  };

  const handleReport = async (index, reviewId) => {
    const result = await handleRequest('reportReview', { reviewNo: reviewId });
    if (result) {
      setReviews(reviews.map((review, i) => i === index ? { ...review, hidden: true } : review));
      alert("리뷰가 신고되었습니다.");
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      const fetchedReviews = await handleRequest('getStoreReviews', { address });
      if (fetchedReviews) setReviews(fetchedReviews.map(review => ({ ...review, hidden: false })));
    };
    if (address) fetchReviews();
  }, [address]);

  return (
    <div ref={ref} className="review-section" style={{ padding: '20px', margin: '20px 0' }}>
      {user ? (
          <>
        <table className="table table-dark table-hover">
          <thead>
            <tr>
            <th colSpan="6"><h3>리뷰를 작성해보세요!</h3></th>
            </tr>
            <tr>
              <th colSpan="4">
                <textarea
                  value={newReviewContent}
                  onChange={(e) => setNewReviewContent(e.target.value)}
                  placeholder="오늘의 맛! 모두가 주목하는 당신의 한줄 평가!"
                  className="form-control"
                  rows="3"
                ></textarea>
              </th>
              <th style={{ textAlign: 'center' }}>
                <button onClick={handleSubmit} className="btn btn-primary" style={{ height: '80px' }}>
                  리뷰 추가
                </button>
              </th>
            </tr>
          </thead>
        </table>
       </>
      ) : (
        <p className="text-center text-danger">리뷰를 작성하려면 로그인이 필요합니다.</p>
      )}

      <table className="table table-dark table-hover mt-4">
        <thead>
          <tr>
           
          </tr>
          <tr>
            <th style={{width:'70%'}}>리뷰 내용</th>
            <th style={{width:'15%'}}>작성일</th>
            <th style={{width:'15%'}}> 작성자</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length > 0 ? reviews.map((review, index) => (
            !review.hidden && (
              <tr key={index}>
                <td style={{ wordBreak: 'break-word' }}>{review.content}</td>
                <td>{new Date(review.modifiedDate).toLocaleDateString()}</td>
                <td>
                  {review.userId}
                  <button onClick={() => handleReport(index, review.reviewNo)} className="btn btn-dark float-right">
                    신고
                  </button>
                </td>
              </tr>
            )
          )) : (
            <tr>
              <td colSpan="6" className="text-center">리뷰가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});

export default ReviewSection;