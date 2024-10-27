import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './MainPage.css';
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
// import SwiperCore from "swiper";
import MyTap from '../MyPage/Components/MyTap'; 
import PigRating from './components/PigRating';



const MainPage = () => {
    const navigate = useNavigate();

    //검색 버튼 눌렀을 때!
  const handleSearch = () => {  
    if(keyword === ""){
      alert("검색어를 입력해주세요");
    }else {
        navigate(`/search?areaNm=${areaNm}&keyword=${keyword}&criteria=party`);
      window.location.reload();
    }
  } 
  // 엔터키 눌렀을 때!
    const onSubmitSearch = (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };

    // 내 주변, 가격순, 방문순 가게 목록
    const [stores, setStores] = useState([]);
    const [fancyStores, setFancyStores] = useState([]);
    const [footStores, setFootStores] = useState([]);

    const [keyword, setKeyword] = useState('');
    const [areaNm, setAreaNm] = useState('전체');

    // 메인 화면 가게 목록 가져오기
    const jointImageList = (menuItems, imgURLs) => {
        let imageList = [];

        menuItems.forEach(item => {
            if(item.image != null){
                imageList = [...imageList, item.image];
            }
        });
        imgURLs.forEach(item => {
            imageList = [...imageList, item];
        });

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
                rating: <PigRating popularity={item.bills}/>,
                imgSrc: jointImageList(item.menuItems, item.imgURLs),
                areaNm: item.areaNm
            })));
            setFancyStores(res.data.highPrice.map((item, i) => ({
                id: i,
                title: item.title,
                address: item.address,
                rating: <PigRating popularity={item.bills}/>,
                imgSrc: jointImageList(item.menuItems, item.imgURLs),
                areaNm: item.areaNm
            })));
            setFootStores(res.data.footStores.map((item, i) => ({
                id: i,
                title: item.title,
                address: item.address,
                rating: <PigRating popularity={item.bills}/>,
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
            // longitude: event.coords.longitude
            latitude: 37.514575,
            longitude: 127.0495556
        };
        fetchStores(coords);
    };

    const handleLocationError = () => {
        console.log("위치 가져오기 실패");
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError);
        }
    }, []);


    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <div className="container-fluid p-0 bg-dark text-white text-center" style={{ height: '2000px', background: '#f0f0f0' }}>
            <img src={`${process.env.PUBLIC_URL}/img/back.jpg`} className="img-fluid p-0" style={{ width: '100%', maxHeight: '60vh', opacity: 0.4, objectFit: 'cover' }} alt="배경 이미지" /> 
            <div style={{ position: 'absolute', top: '0vh', width: '100%', left: 0 }}> 
              <nav className="navbar navbar-expand-sm navbar-dark fixed-top" >
                  {/* <div className='container-fluid'> */}
                      
                          <a className='logo' href='/'>
                              <img src={`${process.env.PUBLIC_URL}/img/newlogo.png`} alt='로고' />
                          </a>
                  {/* </div> */}                      
                {/* 로그인/회원가입 컴포넌트 추가 */}
              </nav>
              <MyTap />
              <div style={{paddingTop:'10%'}}>
                <h1 className="headerfont">꽁밥</h1>
                <p className="font">우리동네 믿고 먹는 맛집 대장!</p>

                <div className="container-fluid input-group mt-3" style={{ width: '48vw' }}>
                    <select className="form-select" onChange={e => setAreaNm(e.target.value)} aria-label="지역 선택" style={{ textAlign: 'center', backgroundColor: 'red', color: 'white', border: 'none' }}>
                        <option value="전체" style={{ backgroundColor: 'white', color: 'black' }}>지역 선택</option>
                        <option value="강남구" style={{ backgroundColor: 'white', color: 'black' }}>강남구</option>
                        <option value="강동구" style={{ backgroundColor: 'white', color: 'black' }}>강동구</option>
                        <option value="강서구" style={{ backgroundColor: 'white', color: 'black' }}>강서구</option>
                        <option value="양천구" style={{ backgroundColor: 'white', color: 'black' }}>양천구</option>
                        <option value="마포구" style={{ backgroundColor: 'white', color: 'black' }}>마포구</option>
                        <option value="종로구" style={{ backgroundColor: 'white', color: 'black' }}>종로구</option>
                    </select>
                    <input type="text" className="form-control s9-3" placeholder="음식, 가게명" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => onSubmitSearch(e)} style={{ width: '15vw' }} />
                    <button className='btn btn-danger' onClick={handleSearch} style={{ flex: 0.5, backgroundColor: 'red', border: 'red' }}>검색</button>
                </div>
              </div>  
            </div>

            {/* 나와 가장 가까운 맛집 추천 */}
      <div className='main-list'>
        <h2 className='subfont' style={{ textAlign: 'left' }}>나와 가장 가까운 맛집 추천</h2>
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }}
          spaceBetween={30}
          slidesPerView={5}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: true,
            speed: 2000,
          }}
        >
          {stores.map(store => (
            <SwiperSlide key={store.id}>
              <div className="restaurant-item">
                <Link to={`/detail/${store.areaNm}/${store.title}`}>
                  <img src={store.imgSrc[0]} alt={store.title} />
                </Link>
                <h6 className='h6'>{store.title}</h6>
                <span>{store.rating}</span>
                <p className='p'>{store.address}</p>
              </div>
            </SwiperSlide>
          ))}
          {/* Navigation Buttons */}
          <div className="swiper-button-prev" ></div>
          <div className="swiper-button-next" ></div>
        </Swiper>
      </div>

      {/* 구매 금액 가장 높은 맛집 추천 */}
      <br />
      <div className='main-list'>
        <h2 className='subfont' style={{ textAlign: 'left' }}>구매 금액 가장 높은 맛집 추천</h2>
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }}
          spaceBetween={30}
          slidesPerView={5}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: true,
            speed: 2000,
          }}
        >
          {fancyStores.map(store => (
            <SwiperSlide key={store.id}>
              <div className="restaurant-item">
                <Link to={`/detail/${store.areaNm}/${store.title}`}>
                  <img src={store.imgSrc[0]} alt={store.title} />
                </Link>
                <h6 className='h6'>{store.title}</h6>
                <span>{store.rating}</span>
                <p className='p'>{store.address}</p>
              </div>
            </SwiperSlide>
          ))}
          {/* Navigation Buttons */}
          <div className="swiper-button-prev" ></div>
          <div className="swiper-button-next" ></div>
        </Swiper>
      </div>

      {/* 방문이 가장 많은 맛집 추천 */}
      <br />
      <div className='main-list'>
        <h2 className='subfont' style={{ textAlign: 'left' }}>방문이 가장 많은 맛집 추천</h2>
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }}
          spaceBetween={30}
          slidesPerView={5}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: true,
            speed: 2000,
          }}
        >
          {footStores.map(store => (
            <SwiperSlide key={store.id}>
              <div className="restaurant-item">
                <Link to={`/detail/${store.areaNm}/${store.title}`}>
                  <img src={store.imgSrc[0]} alt={store.title} />
                </Link>
                <h6 className='h6'>{store.title}</h6>
                <span>{store.rating}</span>
                <p className='p'>{store.address}</p>
              </div>
            </SwiperSlide>
          ))}
           {/* Navigation Buttons */}
          <div className="swiper-button-prev" ></div>
          <div className="swiper-button-next" ></div>
        </Swiper>
      </div>

            <footer className="footer">
                <div className="footer-info">
                <h1 className="headerfont">꽁밥</h1>
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

export default MainPage;