// ReviewSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:8080/reviews');
        setReviews(response.data || []); // 데이터가 없으면 빈 배열로 설정
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("리뷰가 없습니다.");
        } else if (err.response && err.response.status === 400) {
          setError("잘못된 요청입니다.");
        } else {
          setError("리뷰를 가져오는 중 오류가 발생했습니다.");
        }
      }
    };
    
    fetchReviews();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="review-section" style={{ padding: '20px', border: '1px solid #ddd', margin: '20px 0' }}>
      <h2>리뷰</h2>
      {reviews.length === 0 ? (
        <p>리뷰가 없습니다.</p>
      ) : (
        <ul>
          {reviews
            .filter(review => review !== null) // null 값인 리뷰 제외
            .map((review, index) => (
              <li key={index} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
                <h3>작성자: {review.userId || "알 수 없음"}</h3>
                <p>{review.content || "내용이 없습니다."}</p>
                <p>날짜: {review.modifiedDate || "날짜 정보 없음"}</p>
                <p>상태: {review.status || "상태 정보 없음"}</p>
              </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewSection;
