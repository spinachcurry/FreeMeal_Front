import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Signup from '../../MyPage/Modal/Signup';
import '../components/HeaderSection.css';

const HeaderSection = ({ showTags = true, localNm, searching, criteria }) => { 
  
  const [areaNm, setAreaNm] = useState('전체');
  const [keyword, setKeyword] = useState('');
  

  //검색 버튼 눌렀을 때!
  const handleSearch = () => {  
    if(keyword === ""){
      alert("검색어를 입력해주세요");
    }else {
      navigate(`/search?areaNm=${areaNm}&keyword=${keyword}&criteria=${criteria}`);
      window.location.reload();
    }
  } 
  // 네비 버튼 클릭 이벤트!!
  const buttonEvent = (value) => {
    navigate(`/search?areaNm=${localNm}&keyword=${searching}&criteria=${value}`);
    window.location.reload();
  }
  // 엔터키 눌렀을 때!
    const onSubmitSearch = (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };

     // 로그인 관련 코드
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSignupOpen, setSignupModalOpen] = useState(false);
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

    const cssEvent = value => {
        return (value === 'party') ? 
          (criteria === value ? 'btn-left-active' : '')
        : (criteria === value ? 'btn-right-active' : '');
    }

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
        setUser(JSON.parse(storedUser));
        }
    }, []);
    
    return (
        <header className='header'>
            <div className='header-container'>
                {/* <div> */}
                    <a className='logo' href='/'>
                        <img src={`${process.env.PUBLIC_URL}/img/newlogo.png`} alt='로고' />
                    </a>
                    <div className='bossBox' >
                        <div className='searchBox'>
                            <select onChange={e => setAreaNm(e.target.value)}>
                                <option value="전체">지역</option>
                                <option value="강남구">강남구</option>
                                <option value="강동구">강동구</option>
                                <option value="강서구">강서구</option>
                                <option value="강서구">양천구</option>
                                <option value="강서구">강북구</option>
                            </select>
                            <input type='text' placeholder='메뉴, 매장, 음식' onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => onSubmitSearch(e)} />
                            <button onClick={onSubmitSearch}>
                            <img src={`${process.env.PUBLIC_URL}/img/search_white7.png`} style={{ width: '20px' }} alt="search"/>
                                <span>검색</span>
                            </button>
                        </div>
                    </div>
                {/* </div> */}
                {showTags ? (
                    <div className='navBox'>
                        <nav style={{display:'flex', gap: '10px'}}>
                            <button type='button' className={cssEvent('party')} onClick={()=>buttonEvent('party')} >문전성시</button>
                            <button type='button' className={cssEvent('price')} onClick={()=>buttonEvent('price')} >네돈내산</button>
                            {/* <Link to='#' className='nav-item' >네돈내산</Link> */}
                        </nav>
                    </div>
                ) : (
                    <div className='navBox nav-hidden'></div>
                )}
                <div className='user-actions'>
                    {user ? (
                        <>
                            <span>환영합니다, {user.userId}님</span>
                            <button onClick={handleLogout}>로그아웃</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigate('/login')}>로그인</button>
                            <button onClick={() => setSignupModalOpen(true)}>회원가입</button>
                            {isSignupOpen && <Signup onClose={() => setSignupModalOpen(false)} />}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default HeaderSection;
