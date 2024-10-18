import 'bootstrap/dist/css/bootstrap.min.css';
import './MainPage.css';
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'; 
import { Navigation, Pagination } from 'swiper/modules';
import axios from 'axios';
import 'swiper/swiper-bundle.css'; 
import { Link , useNavigate } from 'react-router-dom';
import Signup from './MyPage/Signup';

// import { Link } from 'react-router-dom';

const MainPage = () => {

    // 근처 가게 목록 (좌표 확인 가능 여부)
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null
        
    });
//전체 지도 데이터
    const [stores, setStores] = useState([
        {
            id: null,
            title: "",
            address: "",
            rating: "⭐️⭐️⭐️⭐️",
            imgSrc:""
        }
    ]);

//총 가격 내림차순 지도 데이터(비싼 순서)
    const [fancyStores, setFancyStores] = useState([
        {
            id: null,
            title: "",
            address: "",
            rating: "⭐️⭐️⭐️⭐️",
            imgSrc:""
        }
    ]);

//많이 방문한 순서 지도 데이터
    const [footStores, setFootStores] = useState([
        {
            id: null,
            title: "",
            address: "",
            rating: "⭐️⭐️⭐️⭐️",
            imgSrc:""
        }
    ]);
    
    const [check, setCheck] = useState(false);
    
    
    function success(event) {
        setLocation({
            // latitude: event.coords.latitude,
            // longitude: event.coords.longitude
            latitude: 37.556758733429,
            longitude: 127.15696441277
        });
        if(location.latitude !== null && location.longitude !== null){
            console.log(location.latitude);
            console.log(location.longitude);
            let url = "http://localhost:8080/storeNearby";            
            axios.post(url, location)
                 .then((res)=> {
                    console.log(res.data);
                    let store1 = [];
                    for(let i = 0; i < res.data.nearbyStore.length; i++){
                        let store = {
                            id: i,
                                title: res.data.nearbyStore[i].title,
                                address: res.data.nearbyStore[i].address,
                                rating: "⭐️⭐️⭐️⭐️",
                                imgSrc:""
                        }
                        store1.push(store);
                    }
                    setStores(store1);

                    let store2 = [];
                    for(let i = 0; i < res.data.highPrice.length; i++){
                        let store = {
                            id: i,
                                title: res.data.highPrice[i].title,
                                address: res.data.highPrice[i].address,
                                rating: "⭐️⭐️⭐️⭐️",
                                imgSrc:""
                        }
                        store2.push(store);
                    }
                    setFancyStores(store2);
                    
                    let store3 = [];
                    for(let i = 0; i < res.data.footStores.length; i++){
                        let store = {
                            id: i,
                                title: res.data.footStores[i].title,
                                address: res.data.footStores[i].address,
                                rating: "⭐️⭐️⭐️⭐️",
                                imgSrc:""
                        }
                        console.log(store);
                        store3.push(store);
                    }
                    console.log("tmp array: ", store3);
                    setFootStores(store3);
                    console.log("stores: ", stores);
                })
                 .catch(()=>console.log("오류 났대요~"));
        }else{
            setCheck(!check);
        }
    };

    function error(event) {
    // 실패 했을 때 처리할 콜백 함수
        console.log("위치 가져오기 실패")
    };

    //back  이랑(sts)연결 성공
    useEffect(() => { //await 를 줘서 시간 딜레이를 주기로 해! 0.3초! location해서 계속 가져오니까! 
        if(window.navigator.geolocation) {  // geolocation 지원할 경우 현재 위치 get
            window.navigator.geolocation.getCurrentPosition(success, error);
        }
    },[check]);


    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleMouseEnter = () => setDropdownOpen(true);
    const handleMouseLeave = () => setDropdownOpen(false);

    // 맨 위로 가기
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /////////////////////여기부터 로그인 관련/////////////////////////
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
          useEffect(() => {
            if (user) {
              navigator.geolocation.getCurrentPosition(success);
            }
          }, [user, check]);
   /////////////////////////여기까지 로그인 관련/////////////////////////
    
    
    return (
        <div className="container-fluid p-0 bg-dark text-white text-center" style={{ height: '2000px', background: '#f0f0f0' }}>
            <img src="/static/img/back.jpg" className="img-fluid p-0" style={{ width: '100%', maxHeight: '60vh', opacity: 0.4, objectFit: 'cover' }} alt="배경 이미지" />

            <div style={{ position: 'absolute', top: '0vh', width: '100%', left: 0 }}>
                <ul className='nav justify-content-end'>
                    <nav className='navbar navbar-expand-sm navbar-dark fixed-top'>
                        <div className="nav-item dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                            <button className='btn btn-primary' style={{ backgroundColor: 'red' }}>
                                메뉴
                            </button>
                            {dropdownOpen && (
                                <ul className="dropdown-menu show">
                                    <li><a className="dropdown-item" href="#">지역별</a></li>
                                    <li><a className="dropdown-item" href="#">가격별</a></li>
                                    <li><a className="dropdown-item" href="#">방문별</a></li>
                                </ul>
                            )}
                        </div>
                    </nav>

                    {user ? (
                    <li className="nav-item">
                        <p className="nav-link" style={{ color: 'white', fontWeight: '1000' }}>
                        환영합니다, <Link to="/myPage" style={{ color: 'white' }}>{user.userId}</Link>님 
                        <a onClick={handleLogout} className="btn btn-primary"> 로그아웃</a> </p> 
                    </li>
                ) : ( 
                    <>
                        <li className="nav-item">
                        {/* <li className="nav-item">?</li> */}
                        <a onClick={handleLoginOpen} className="nav-link" > 로그인 </a>
                        </li>
                        <li className="nav-item">
                        <a onClick={handleSignupOpen} className="nav-link" >회원가입</a>
                        </li>
                    </>
                )}  {isSignupOpen && <Signup onClose={handleSignupClose} />}
                </ul>   

                <h1 className="gff">꽁밥</h1>
                <p className="secTitle">우리동네 믿고 먹는 맛집 대장!</p>

                <div className="container-fluid input-group mt-3" style={{ margin: '0 30vw', width: '40vw' }}>
                        {/* 지역 선택 select 박스 */}
                        <select className="form-select" aria-label="지역 선택" style={{ textAlign:'center',backgroundColor: 'red', color: 'white', border:'none'}}>
                            <option value="" style={{backgroundColor:'white', color:'black'}}> 지역 선택</option>
                            <option value="강남구" style={{backgroundColor:'white', color:'black'}}>강남구</option>
                            <option value="강동구" style={{backgroundColor:'white', color:'black'}}>강동구</option>
                            <option value="강서구" style={{backgroundColor:'white', color:'black'}}>강서구</option>
                            <option value="양천구" style={{backgroundColor:'white', color:'black'}}>양천구</option>
                            <option value="마포구" style={{backgroundColor:'white', color:'black'}}>마포구</option>
                            <option value="종로구" style={{backgroundColor:'white', color:'black'}}>종로구</option>
                        </select>

                        {/* 텍스트 입력 및 버튼 */}
                        <input
                            type="text"
                            className="form-control s9-3"
                            placeholder="오늘 뭐 먹지?"
                            style={{ width:'15vw'}}
                        />
                        <button
                            type="button"
                            className="btn btn-primary"
                            style={{ flex: 0.5, backgroundColor: 'red', border: 'red' }}
                        >
                            검색
                        </button>
                </div>
            </div>

            <div>
                <h2 style={{ textAlign: 'left', fontSize: '25px' }}>나와 가장 가까운 맛집 추천</h2>
                <Swiper modules={[Navigation, Pagination]} spaceBetween={30} slidesPerView={4} navigation className="swiper-container">
                    {stores.map((store) => (
                        <SwiperSlide key={store.id} className="swiper-slide">
                            <div className="restaurant-item">
                                <Link to=""><img src={store.imgSrc} alt={store.title}/></Link>
                                <h3>{store.title}</h3>
                                <span>{store.rating}</span>
                                <p>{store.address}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <br></br>
            <div>
                <h2 style={{ textAlign: 'left', fontSize: '25px' }}>구매 금액 가장 높은 맛집 추천</h2>
                <Swiper modules={[Navigation, Pagination]} spaceBetween={30} slidesPerView={4} navigation className="swiper-container">
                    {fancyStores.map((store) => (
                        <SwiperSlide key={store.id} className="swiper-slide">
                            <div className="restaurant-item">
                            <Link to=""><img src={store.imgSrc} alt={store.title}/></Link>
                                <h3>{store.title}</h3>
                                <span>{store.rating}</span>
                                <p>{store.address}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <br></br>
            <div>
                <h2 style={{ textAlign: 'left', fontSize: '25px' }}>방문이 가장 많은 맛집 추천</h2>
                <Swiper modules={[Navigation, Pagination]} spaceBetween={30} slidesPerView={4} navigation className="swiper-container">
                    {footStores.map((store) => (
                        <SwiperSlide key={store.id} className="swiper-slide">
                            <div className="restaurant-item">
                            <Link to=""><img src={store.imgSrc} alt={store.title}/></Link>
                                <h3>{store.title}</h3>
                                <span>{store.rating}</span>
                                <p>{store.address}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
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

export default MainPage;
