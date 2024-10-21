import 'bootstrap/dist/css/bootstrap.min.css';
import './MainPage.css';
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'; 
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
// import 'swiper/swiper-bundle.css'; 
import axios from 'axios';
import  { Link , useNavigate } from 'react-router-dom';
import Signup from '../MyPage/Signup';

const MainPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    //브라우저 위치 정보
    const [location, setLocation] = useState({ latitude: null, longitude: null });
   
    //내 주변
    const [stores, setStores] = useState([]);
    //가격순
    const [fancyStores, setFancyStores] = useState([]);
    //방문순
    const [footStores, setFootStores] = useState([]);

    const [isSignupOpen, setSignupModalOpen] = useState(false);
    const [check, setCheck] = useState(false);
  
    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);
  
    const handleSignupOpen = () => setSignupModalOpen(true);
    const handleSignupClose = () => setSignupModalOpen(false);
    const handleLoginOpen = () => navigate('/login');
    const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('jwtToken');
    };

      const [keyword, setKeyword] = useState('');
      const [areaNm, setAreaNm] = useState('전체');
      const handleSearch = () => {
        if(keyword === ""){
          alert("검색어를 입력해주세요");
        }else {
          navigate("/search?areaNm=" + [areaNm] + "&" + "keyword=" + [keyword]);
        };
      }    

  //  메인 화면 가게 목록 가져오기
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

    const fetchStores = async (coords) => {
        try {
            const url = "http://localhost:8080/storeNearby";
            const res = await axios.post(url, coords); 
            console.log(res.data);
        
        setStores(res.data.nearbyStore.map((item, i) => ({
          id: i,
          title: item.title,
          address: item.address,
          rating: "⭐️⭐️⭐️⭐️",
          imgSrc: jointImageList(item.menuItems, item.imgURLs),
          areaNm: item.areaNm
        })));

        setFancyStores(res.data.highPrice.map((item, i) => ({
          id: i,
          title: item.title,
          address: item.address,
          rating: "⭐️⭐️⭐️⭐️",
          imgSrc: jointImageList(item.menuItems, item.imgURLs),
          areaNm: item.areaNm
        })));

        setFootStores(res.data.footStores.map((item, i) => ({
          id: i,
          title: item.title,
          address: item.address,
          rating: "⭐️⭐️⭐️⭐️",
          imgSrc: jointImageList(item.menuItems, item.imgURLs),
          areaNm: item.areaNm
        })));
      } catch (error) {
        console.error("가게 목록 불러오기 오류:", error);
      }
    };
  
    const handleLocationSuccess = (event) => {
      const coords = {
        // latitude: event.coords.latitude,
        // longitude: event.coords.longitude,
        latitude: 37.514575,
        longitude: 127.0495556

      };
      setLocation(coords);
      fetchStores(coords);
    };
  
    const handleLocationError = () => {
      console.log("위치 가져오기 실패");
      setCheck(!check);
    };
  
    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError);
      }
    }, [check]);
  
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    

    return (
      <div className="container-fluid p-0 bg-dark text-white text-center" style={{ height: '2000px', background: '#f0f0f0' }}>
        <img src={`${process.env.PUBLIC_URL}/img/back.jpg`} className="img-fluid p-0" style={{ width: '100%', maxHeight: '60vh', opacity: 0.4, objectFit: 'cover' }} alt="배경 이미지" />
  
        <div style={{ position: 'absolute', top: '0vh', width: '100%', left: 0 }}>
            <nav className="navbar navbar-expand-sm navbar-dark fixed-top" >
            <div className='container-fluid'>
              <h1 className='header'>
                <a className='logo' href='/'>
                  <img src={`${process.env.PUBLIC_URL}/img/newlogo.png`} alt='로고' />
                </a>
              </h1>
              </div>
            </nav>
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
  
          <h1 className="headerfont">꽁밥</h1>
          <p className="font">우리동네 믿고 먹는 맛집 대장!</p>
              <div className="container-fluid input-group mt-3" style={{width: '48vw'}}>
                  <select className="form-select" onChange={e => setAreaNm(e.target.value)} aria-label="지역 선택" style={{ textAlign:'center', backgroundColor: 'red', color: 'white', border:'none' }}>
                    <option value="전체" style={{ backgroundColor:'white', color:'black' }}>지역 선택</option>
                    <option value="강남구" style={{backgroundColor:'white', color:'black'}}>강남구</option>
                    <option value="강동구" style={{backgroundColor:'white', color:'black'}}>강동구</option>
                    <option value="강서구" style={{backgroundColor:'white', color:'black'}}>강서구</option>
                    <option value="양천구" style={{backgroundColor:'white', color:'black'}}>양천구</option>
                    <option value="마포구" style={{backgroundColor:'white', color:'black'}}>마포구</option>
                    <option value="종로구" style={{backgroundColor:'white', color:'black'}}>종로구</option>
                  </select>
                  <input type="text" className="form-control s9-3" placeholder="음식, 가게명" value={keyword} onChange={(e) => setKeyword(e.target.value)} style={{ width:'15vw' }} />
                    {/* 가게 검색 결과 */}
                  <button className='btn btn-danger' onClick={handleSearch} style={{ flex: 0.5, backgroundColor: 'red', border: 'red'}}>검색</button>
              </div>
        </div>
  
        <div className='main-list'> 
          <h2 className='subfont' style={{ textAlign: 'left'}}>나와 가까운 맛집 추천</h2>
          <Swiper modules={[Autoplay, Navigation, Pagination]}
              navigation className="swiper-container"
              spaceBetween={30} slidesPerView={5} loop={true} 
              autoplay={{delay: 2500, disableOnInteraction: true, speed:3000}}>
            {stores.map(store => (
              <SwiperSlide key={store.id} className="swiper-slide">
                <div className="restaurant-item">
                  <Link to={`/detail/${store.areaNm}/${store.title}`}><img src={store.imgSrc[0]} alt={store.title} /></Link>
                  <h6 className='h6'>{store.title}</h6>
                  <span>{store.rating}</span>
                  <p className='p'>{store.address}</p>
              </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <br></br>
        <div className='main-list'> 
          <h2 className='subfont' style={{ textAlign: 'left'}}>구매 금액 가장 높은 맛집 추천</h2>
          <Swiper modules={[Autoplay, Navigation, Pagination]}
              navigation className="swiper-container"
              spaceBetween={30} slidesPerView={5} loop={true} 
              autoplay={{delay: 2500, disableOnInteraction: true, speed:2000}} >
            {fancyStores.map(store => (
              <SwiperSlide key={store.id} className="swiper-slide">
                <div className="restaurant-item">
                  <Link to={`/detail/${store.areaNm}/${store.title}`}><img src={store.imgSrc[0]} alt={store.title} /></Link>
                  <h6 className='h6'>{store.title}</h6>
                  <span>{store.rating}</span>
                  <p className='p'>{store.address}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <br></br>
        <div className='main-list'>
          <h2 className='subfont' style={{ textAlign: 'left'}}>방문이 가장 많은 맛집 추천</h2>
          <Swiper modules={[Autoplay, Navigation, Pagination]}
              navigation className="swiper-container"
              spaceBetween={30} slidesPerView={5} loop={true} 
              autoplay={{delay: 2500, disableOnInteraction: true, speed:2000}} >
            {footStores.map(store => (
              <SwiperSlide key={store.id} className="swiper-slide">
                <div className="restaurant-item">
                  <Link to={`/detail/${store.areaNm}/${store.title}`}><img src={store.imgSrc[0]} alt={store.title} /></Link>
                  <h6 className='h6'>{store.title}</h6>
                  <span>{store.rating}</span>
                  <p className='p'>{store.address}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
  
        <footer className="footer">
          <div className="footer-info" >

            <h2 className='footerfont'>꽁밥</h2>
            <p>주소: 서울특별시 종로구 평창로 123</p>
            <p>전화: 02-1234-5678</p>
            <p>이메일: info@ggongbob.com</p>
            <p>개인정보처리방침 | 이용약관</p>
            <p>&copy; 2024 꽁밥. All rights reserved.</p>
          </div>
        </footer>
            <button className="scroll-to-top" onClick={scrollToTop}>맨 위로 가기</button>
      </div>
    );
  };
  
  export default MainPage;