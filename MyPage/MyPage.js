
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './MyPage.css';
import MyReviews from './MyReviews'; 
import MyFavoriteStores from './MyFavoriteStores'; 

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
const MyPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('MyReviews'); 
  const host = "http://localhost:8080/mypage/view?url=";

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <p>로그인이 필요합니다.</p>;
  }


  const profileImage = user.profileImageUrl ? host + user.profileImageUrl :'./img/user1.png';
  return (
    <>
      <div className="container text-center py-5">
      <h1 className='header'>
            <a className='logo' href='/'>
                <img src={`${process.env.PUBLIC_URL}/img/newlogo.png`} alt='로고'/>
            </a> 마이 페이지</h1>  
        <br/> 
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
          <button onClick={() => setActiveTab('MyFavoriteStores')} className="btn btn-primary my-2">내가 찜한 가게</button>
        </div>
      </div>   
      <div className="container  ">
        {activeTab === 'MyReviews' && <MyReviews />}
        {activeTab === 'MyFavoriteStores' && <MyFavoriteStores  userId={user.userId}/>}
 
        <footer className="footer">
          <div className="footer-info" > 
            <h2>꽁밥</h2>
            <p>주소: 서울특별시 종로구 평창로 123</p>
            <p>전화: 02-1234-5678</p>
            <p>이메일: info@ggongbob.com</p>
            <p>개인정보처리방침 | 이용약관</p>
            <p>&copy; 2024 꽁밥. All rights reserved.</p>
            <button className="scroll-to-top" onClick={scrollToTop}>맨 위로 가기</button>
          </div>
        </footer>

      </div>
    </>
  );
};

export default MyPage;
