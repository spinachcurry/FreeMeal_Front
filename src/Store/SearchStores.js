import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Signup from '../MyPage/Signup';
import './SearchStores.css';

const SearchStores = () => {  
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState('');
  const [areaNm, setAreaNm] = useState('전체');
  const [stores, setStores] = useState([]);
  const localNm = searchParams.get("areaNm");
  const searching = searchParams.get("keyword");
  const handleSearch = () => {
    if(keyword === ""){
      alert("검색어를 입력해주세요");
    }else {
      navigate("/search?areaNm=" + [areaNm] + "&" + "keyword=" + [keyword]);
    };
  } 

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const fetchStores = async (keykeyword) => {
    try {
      const url = "http://localhost:8080/searchStore";
      const res = await axios.post(url, keykeyword);
      console.log(res.data);
      setStores(res.data.map((item, i) => ({
        id: i,
        title: item.title,
        address: item.address,
        category: item.category,
        // rating: "⭐️⭐️⭐️⭐️",
        // imgSrc: "",
        areaNm: item.areaNm
      })));      
    } catch (error) {
      console.error("가게 정보가 없습니다:", error);
    }
  };
  
  useEffect(()=> {
    if(localNm !==null && localNm !== "" && searching !== null && searching !== "") {
      const keykeyword = {areaNm: localNm, keyword: searching}
      fetchStores(keykeyword);      
    }else {
      alert("검색어가 없습니다.");
    }
      // console.log("지역: " + localNm);
      // console.log("키워드: " + searching);
  }, []);

  // 화면에 렌더링할 JSX
  return (
    <div className="container-fluid p-0 bg-dark text-white" style={{ height: '1500px' }}>
      <header style={{paddingBottom:'100px'}}>
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark fixed-top" style={{ borderBottom: '1px solid white' }}>
        <div className='container-fluid'>
          <h1 className='header'>
            <a className='logo' href='/'>
              <img src={`${process.env.PUBLIC_URL}/img/newlogo.png`} alt='로고' />
            </a>
          </h1>
          <div className="container-fluid input-group mt-3" style={{ alignItems: 'center', margin:'auto', width: '50vw'}}>
              <select className="form-select" onChange={e => setAreaNm(e.target.value)} aria-label="지역 선택" style={{ textAlign:'center', backgroundColor: 'red', color: 'white', border:'none' }}>
                  <option value="전체" style={{ backgroundColor:'white', color:'black' }}>지역 선택</option>
                  <option value="강남구" style={{backgroundColor:'white', color:'black'}}>강남구</option>
                  <option value="강동구" style={{backgroundColor:'white', color:'black'}}>강동구</option>
                  <option value="강서구" style={{backgroundColor:'white', color:'black'}}>강서구</option>
                  <option value="양천구" style={{backgroundColor:'white', color:'black'}}>양천구</option>
                  <option value="마포구" style={{backgroundColor:'white', color:'black'}}>마포구</option>
                  <option value="종로구" style={{backgroundColor:'white', color:'black'}}>종로구</option>
              </select>
              <input type="text" className="form-control s9-3" placeholder="음식, 매장" value={keyword} onChange={(e) => setKeyword(e.target.value)} style={{ width:'15vw' }} />
              <button type="button" className="btn btn-danger" onClick={handleSearch} style={{flex: 0.5, backgroundColor: 'red', border: 'red'}}>
                <img src={`${process.env.PUBLIC_URL}/img/search_white7.png`} style={{ width: '20px' }} alt="search"/>
                <span style={{ margin: '5px' }}>검색</span>
                {/* <button className='btn btn-danger' onClick={handleSearch} style={{ flex: 0.5, backgroundColor: 'red', border: 'red'}}>검색</button> */}
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
        </div>
        </nav>
      </header>
      <main>
          <h3>검색 결과 나와라</h3>
            <div className='container' style={{minHeight:'0px', height:'auto'}}>
              <div className='contents' style={{height:'auto'}}>
                <section className='center' style={{height:'auto', margin:'0 auto', width:'650px'}}>
                  <div className='search_menu'>
                    
                      <ul className='localFood_list' style={{ display: 'flex', flexWrap: 'wrap', padding: '0', listStyle: 'none' }}>
                        {/* li 태그 반복! */}
                        <li className='data' style={{border: '1px solid white'}}>
                          <figure>
                          <a target='_blank' href="https://www.siksinhot.com/P/1270425">
                            <img className='img' src="https://img.siksinhot.com/place/1696391990972242.jpg?w=560&h=448&c=X" alt="Store"></img>
                          </a>
                          </figure>
                          <figcaption>
                            <a className='textBox' target='_blank' href='https://smartstore.naver.com/herge_dosan'>
                              <h2>에르제</h2>
                              <span className='score' style={{color:'white'}}>평가중</span>
                            </a>
                              <p className='cafe'>
                                <span><a>성수</a></span>
                              </p>
                          </figcaption>
                        </li>

                        <li className='data' style={{border: '1px solid white'}}>

                        </li>

                      </ul>
                    
                  </div>
                </section>
              </div>
            </div>
      </main> 

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
    </div>
  );
};

export default SearchStores;
