// SearchStores.js
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'swiper/swiper-bundle.css'; // Swiper 스타일
import React, { useState, useEffect } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react'; 
// import { Navigation, Pagination } from 'swiper/modules';
import { Link , useNavigate } from 'react-router-dom';

const SearchStores =  () => {

// 맨 위로 가기(스크롤)
const scrollToTop = () => {
window.scrollTo({ top: 0, behavior: 'smooth' });
};

//검색하면 불러올 가게들
const [stores, setStores] = useState([]);

const fetchStores = async (coords) => {
    try {
        const url = "http://localhost:8080/searchStore"
        const res = await axios.post(url, coords);
    setStores(res.data.SearchStores.map((item, i)=> ({
        id: i,
        title: item.title,
        areaNm: item.areaNm,
        category: item.category,
        rating: "⭐️⭐️⭐️⭐️",
        imgSrc: ""
      })));
    } catch(error) {
        console.log("에러다", error);
    }
}  
 //////////////////////////로그인 관련/////////////////////////
    // 로그인 관련  // 사용자 상태 및 위치 상태
       const navigate = useNavigate();
       const [user, setUser] = useState(null);
       const [isSignupOpen, setSignupModalOpen] = useState(false);
       // 회원가입, 로그인, 로그아웃 핸들러
       const handleSignupOpen = () => setSignupModalOpen(true);
       const handleSignupClose = () => setSignupModalOpen(false);
       const handleLoginOpen = () => { 
           navigate('/login');
       }
       // 로그인된 사용자 정보 로드
       useEffect(() => {
           const storedUser = localStorage.getItem('user');
           if (storedUser) {
               setUser(JSON.parse(storedUser));
           }
       }, []);
       //로그아웃시 토큰 삭제
       const handleLogout = () => {
           setUser(null);
           localStorage.removeItem('user');
           localStorage.removeItem('jwtToken');
         };
  /////////////////////////로그인 관련/////////////////////////
  return(

    <div className="container-fluid p-0 bg-dark text-white text-center" style={{ height: '2000px', background: '#f0f0f0' }}>
        {/* <img src="/static/img/back.jpg" className="img-fluid p-0" style={{ width: '100%', maxHeight: '60vh', opacity: 0.4, objectFit: 'cover' }} alt="배경 이미지" /> */}
        <div>
                    <ul className='nav justify-content-end'>
                        <nav className='navbar navbar-expand-sm navbar-dark'>
                            <div className="container-fluid fixed-top">
                                <a className='rounded-pill' href="#">
                                    <img src='/logo.png' alt="로고자리" /> 
                                </a>
                            </div>
                        </nav>

                        <li className="nav">
                            <a className="nav-link" style={{ color: 'white', fontWeight: '1000' }} href="#">로그인</a>
                        </li>
                        <li className="nav">
                            <a className="nav-link" style={{ color: 'white', fontWeight: '1000' }} href="#">회원가입</a>
                        </li>
                    </ul>

                    <div className="container-fluid input-group mt-3 mb-3"  style={{ margin: '0 30vw', width: '40vw' }}>
                        <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" style={{backgroundColor:'red'}}
                        >지역 선택  </button>

                        {/* 드롭다운 목록 */}
                        <ul className="dropdown-menu" style={{ width: '200px' }}>
                            <li><a className="dropdown-item" href="#">강남구</a></li>
                            <li><a className="dropdown-item" href="#">강동구</a></li>
                            <li><a className="dropdown-item" href="#">강서구</a></li>
                            <li><a className="dropdown-item" href="#">양천구</a></li>
                            <li><a className="dropdown-item" href="#">마포구</a></li>
                            <li><a className="dropdown-item" href="#">종로구</a></li>
                        </ul>
                        {/* 텍스트 입력 및 버튼 */}
                        <input
                            type="text" className="form-control s9-3" placeholder="오늘 뭐 먹지?"/>
                        <button
                            type="button" className="btn btn-primary" style={{ flex: 0.4, backgroundColor: 'red', border: 'red' }}
                        >검색 </button>
                    </div>
                </div>


                    <div>
                    <h2 style={{ textAlign: 'left', fontSize: '25px' }}>검색 결과</h2>
                    <Swiper modules={[Navigation, Pagination]} spaceBetween={30} slidesPerView={2} navigation className="swiper-container">
                        {stores.map(store => (
                        <SwiperSlide key={store.id} className="swiper-slide">
                            <div className="restaurant-item">
                            <Link to={`/detail/${store.areaNm}/${store.title}`}><img src={store.imgSrc} alt={store.title} /></Link>
                            <h3>{store.title}</h3>
                            <span>{store.rating}</span>
                            <p>{store.address}</p>
                            </div>
                    </SwiperSlide>
                        ))}
                    </Swiper>
                    <br></br>
                    </div>

                <footer className="footer">
                    <div className="footer-info">
                        <h2>꽁밥</h2>
                        <p>주소: 서울특별시 종로구 평창로 123</p>
                        <p>전화: 02-1234-5678</p>
                        <p>이메일: info@ggongbob.com</p>
                        <p>개인정보처리방침 | 이용약관</p>
                        <p>&copy; 2024 꽁밥. All rights reserved.</p>
                        <button className="scroll-to-top" onClick={scrollToTop}>
                            맨 위로 가기
                        </button>
                    </div>
                </footer>






</div>

  );
};

export default SearchStores;
