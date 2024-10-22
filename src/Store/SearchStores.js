import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Signup from '../MyPage/Signup';
import './SearchStores.css';

const SearchStores = () => {  
  const [searchParams, setSearchParams] = useSearchParams();
  const [areaNm, setAreaNm] = useState('전체');
  const [keyword, setKeyword] = useState('');
  const [criteria, setCriteria] = useState('party');
  const [stores, setStores] = useState([]);
  const localNm = searchParams.get("areaNm");
  const searching = searchParams.get("keyword");
  
  //검색 버튼 눌렀을 때!
  const handleSearch = () => {
    if(keyword === ""){
      alert("검색어를 입력해주세요");
    }else {
      navigate("/search?areaNm=" + [areaNm] + "&" + "keyword=" + [keyword]);
    }
  } 
  // 엔터키 눌렀을 때!
    const onSubmitSearch = (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };
    

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

  // 검색 후 가게 목록 반복할 코드
  const jointImageList = (menuItems, imgURLs) => {
    let imageList = [];

    menuItems.forEach(item => {
      if(item.image != null){
        imageList = [...imageList, item.image];
      }
    });

    imgURLs.forEach(item => {
      imageList = [...imageList, item];
    })

    if(imageList.length === 0) {
      imageList = ["/img/noimage.png"]; 
    }
    return imageList;
  }

  const ShowstoreList = async(keykeyword) =>  {
     try {
          const url = "http://localhost:8080/searchStore";
          const res = await axios.post(url, keykeyword);
          console.log(res.data);
        setStores(res.data.map((item, i) => ({ 
        address: item.address, 
        category: item.category,
        id: i,
        title: item.title,
        imgSrc: jointImageList(item.menuItems, item.imgURLs),
        rating: "⭐️⭐️⭐️⭐️",
        areaNm: item.areaNm,
      })));

       } catch(error) {
        console.log("오류났다잉~:", error);
      }
    };

  useEffect(()=> {
    if(localNm !==null && localNm !== "" && searching !== null && searching !== "") {
      const keykeyword = {areaNm: localNm, keyword: searching, criteria: criteria};
      
      ShowstoreList(keykeyword);     
    }else {
      alert("검색어가 없습니다.");
    }
      // console.log("지역: " + localNm);
      // console.log("키워드: " + searching);
  }, [criteria]);


  //enter키 이벤트
  
  // 화면에 렌더링할 JSX
  return (
    <div className="container-fluid p-0 bg-dark text-white" style={{ height: '1500px' }}>

          <header className='header'>
            <div className='container-fluid'>
             {/* <header className='headers'style={{borderBottom:'1px solid #ddd'}}> */}
              <div className='row'>
                <a className='logo col-1' href='/'>
                  <img src={`${process.env.PUBLIC_URL}/img/newlogo.png`} alt='로고' />
                </a>
                <div className='col-4' style={{marginTop:'5px'}}>
                  <div className="container-fluid input-group" >
                      <select className="form-select" onChange={e => setAreaNm(e.target.value)} aria-label="지역 선택" style={{ textAlign:'center', backgroundColor: 'red', color: 'white', border:'none' }}>
                          <option value="전체" style={{ backgroundColor:'white', color:'black' }}>지역</option>
                          <option value="강남구" style={{backgroundColor:'white', color:'black'}}>강남구</option>
                          <option value="강동구" style={{backgroundColor:'white', color:'black'}}>강동구</option>
                          <option value="강서구" style={{backgroundColor:'white', color:'black'}}>강서구</option>
                          <option value="양천구" style={{backgroundColor:'white', color:'black'}}>양천구</option>
                          <option value="마포구" style={{backgroundColor:'white', color:'black'}}>마포구</option>
                          <option value="종로구" style={{backgroundColor:'white', color:'black'}}>종로구</option>
                      </select>
                      <input type="text" className="form-control s9-3" placeholder="음식, 매장" value={keyword}
                              onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e)=> { if(e.key === 'Enter') {handleSearch(); } }} style={{ width:'10vw' }} />
                      <button type="button" className="btn btn-danger" onClick={handleSearch} style={{flex: 0.5, backgroundColor: 'red', border: 'red'}}>
                        <img src={`${process.env.PUBLIC_URL}/img/search_white7.png`} style={{ width: '20px' }} alt="search"/>
                        <span style={{ margin: '5px' }}>검색</span>
                      </button>
                  </div>
                </div>
                <div className='col-4'>
                  {/* <nav className='navbar navbar-expand-sm' style={{marginTop:'0px'}}> */}
                    {/* 잘 고쳐보자 */}
                    <nav className='nav nav-justified'>
                      <li className="nav-item" style={{marginRight:'20px'}}>
                        <span className='nav-link active' data-bs-toggle='tab' >문전성시</span>
                      </li>
                      <li className="nav-item">
                        <span className='nav-link active' data-bs-toggle='tab' >네돈내산</span>
                      </li>
                    </nav>
                  {/* </nav> */}
                </div>
                <div className='col-3'>
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
              </div>
            {/* </header>  */}
          </div>
        </header>  
        <main style={{display:'flex', justifyContent:'center'}}>
            <div className='container'>
              {/* <div className='contents'> */}
                {/* <section className='center'> */}
                  {/* <div className='search_menu'> */}
                  <ul className='localFood_list'>
{/* li 태그 반복! >> 마우스 클릭 시 문전성시 탭으로 가야함 */}
                      {stores.map((store) => (
                        <li className='data' key={store.id}>
                          <div style={{margin:'10px', border:'1px solid grey', height:'100%', overflow:'hidden'}}>
                           <Link to={`/detail/${store.areaNm}/${store.title}`}>
                              <figure>
                                  <img className='img' src={store.imgSrc[0]} alt={store.title}></img>
                              </figure>
                              <figcaption>
                                <div className='textBox' target='_blank'>
                                  <h2>{store.title}</h2>
                                  <span className='score' style={{color:'white'}}>{store.rating}</span>
                                </div>
                                  <span>{store.address}</span>
                              </figcaption>
                            </Link>
                            </div>
                          </li>
                        ))}
                    </ul>
                  {/* </div> */}
                {/* </section> */}
              {/* </div> */}
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