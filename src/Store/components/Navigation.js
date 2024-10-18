import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Signup from '../MyPage/Signup';

const Navigation = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSignupOpen, setSignupModalOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [areaNm, setAreaNm] = useState('전체');

  const handleSignupOpen = () => setSignupModalOpen(true);
  const handleSignupClose = () => setSignupModalOpen(false);
  const handleLoginOpen = () => { 
    navigate('/login');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('jwtToken');
  };

  const handleSearch = () => {
    if (keyword === '') {
      alert('검색어를 입력해주세요');
    } else {
      navigate(`/search?areaNm=${areaNm}&keyword=${keyword}`);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="container-fluid input-group" style={{ alignItems: 'center', margin:'auto', width: '50vw'}}>
        <select className="form-select" onChange={e => setAreaNm(e.target.value)} aria-label="지역 선택" style={{ textAlign:'center', backgroundColor: 'red', color: 'white', border:'none' }}>
          <option value="전체" style={{ backgroundColor:'white', color:'black' }}>지역 선택</option>
          <option value="강남구" style={{backgroundColor:'white', color:'black'}}>강남구</option>
          <option value="강동구" style={{backgroundColor:'white', color:'black'}}>강동구</option>
          <option value="강서구" style={{backgroundColor:'white', color:'black'}}>강서구</option>
          <option value="양천구" style={{backgroundColor:'white', color:'black'}}>양천구</option>
          <option value="마포구" style={{backgroundColor:'white', color:'black'}}>마포구</option>
          <option value="종로구" style={{backgroundColor:'white', color:'black'}}>종로구</option>
        </select>
        <input type="text" className="form-control s9-3" placeholder="음식, 매장" value={keyword}
          onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e)=> { if(e.key === 'Enter') {handleSearch(); } }} style={{ width:'15vw' }} />
        <button type="button" className="btn btn-danger" onClick={handleSearch} style={{flex: 0.5, backgroundColor: 'red', border: 'red'}}>
          <img src={`${process.env.PUBLIC_URL}/img/search_white7.png`} style={{ width: '20px' }} alt="search"/>
          <span style={{ margin: '5px' }}>검색</span>
        </button>
      </div>

      <ul className='nav justify-content-end' style={{ color: 'white', fontWeight: '1000' }}>
        {user ? (
          <>
            <li className="nav-item">
              <p className="nav-link">
                환영합니다, <Link to="/myPage" style={{ color: 'white' }}>{user.userId}</Link>님 
              </p> 
            </li>
            <li className="nav-item">
              <p>
                <a onClick={handleLogout} className="nav-link"> 로그아웃</a> 
              </p>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <p>
                <a onClick={handleLoginOpen} className="nav-link">로그인</a>
              </p>
            </li>
            <li className="nav-item">
              <p>
                <a onClick={handleSignupOpen} className="nav-link">회원가입</a>
              </p>
            </li>
          </>
        )}
        {isSignupOpen && <Signup onClose={handleSignupClose} />}
      </ul>

      <footer className="footer">
        <div className="footer-info">
          <h2>꽁밥</h2>
          <p>주소: 서울특별시 종로구 평창로 123</p>
          <p>전화: 02-1234-5678</p>
          <p>이메일: info@ggongbob.com</p>
          <p>개인정보처리방침 | 이용약관</p>
          <p>&copy; 2024 꽁밥. All rights reserved.</p>
          <button className="scroll-to-top" onClick={scrollToTop}>맨 위로 가기</button>
        </div>
      </footer>
    </>
  );
};

export default Navigation;
