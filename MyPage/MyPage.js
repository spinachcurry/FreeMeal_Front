// MyPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import user1 from '../img/user1.png';
import './MyPage.css';
import MyReviews from './MyReviews'; // 내가 쓴 리뷰 컴포넌트
import FavoriteStores from './FavoriteStores'; // 내가 찜한 가게 컴포넌트

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('MyReviews'); // 'myReviews' 또는 'favoriteStores'
  const host = "http://localhost:8080/view?url=";

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <p>로그인이 필요합니다.</p>;
  }

  const profileImage = user.profileImageUrl ? host + user.profileImageUrl : user1;

  return (
    <>
      <div className="container text-center py-5">
        <h1>마이 페이지</h1> 
        <Link to="/" className="btn btn-secondary my-3 nav-item back-to-home">꽁밥으로 돌아가기</Link>
        <img 
          src={profileImage} 
          alt="프로필 이미지" 
          className="rounded-circle" 
          style={{ width: '250px', height: '250px', objectFit: 'cover' }} 
        />
        <p className="mt-3">사용자 {user.user_Nnm}님, 환영합니다.</p> 
        <p>한마디: {user.review}</p>
        <div>
          <Link to="/updateUserInfo" className="btn btn-primary my-2">회원정보 수정</Link>  
          <button onClick={() => setActiveTab('MyReviews')} className="btn btn-primary my-2">내가 쓴 리뷰</button>
          <button onClick={() => setActiveTab('favoriteStores')} className="btn btn-primary my-2">내가 찜한 가게</button>
        </div>
      </div> 

      {/* 조건부 렌더링 */}
      <div className="container mt-5">
        {activeTab === 'MyReviews' && <MyReviews />}
        {activeTab === 'favoriteStores' && <FavoriteStores />}
      </div>
    </>
  );
};

export default MyPage;
