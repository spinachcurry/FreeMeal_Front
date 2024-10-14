import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'swiper/swiper-bundle.css';
import './DetailPage.css';
import KakaoMap from './components/KakaoMap';
import ReviewSection from '../MyPage/ReviewSection';
import Dids from '../MyPage/Dids';
import logo from '../img/logo.jpg';

const DetailPage = () => {
    const { storeId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [store, setStore] = useState(null);
    const [images, setImages] = useState([
        './static/img/pasta.jpg',
        './static/img/pasta.jpg',
        './static/img/pasta.jpg',
        './static/img/pasta.jpg',
    ]);
    const [loading, setLoading] = useState(true);
    const [isSignupOpen, setSignupModalOpen] = useState(false);

    const handleSignupOpen = () => setSignupModalOpen(true);
    const handleSignupClose = () => setSignupModalOpen(false);
    const handleLoginOpen = () => navigate('/login');

    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);

    const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('jwtToken');
    };

    useEffect(() => {
        const decodedStoreId = decodeURIComponent(storeId); 
        fetchStoreDetail(decodedStoreId); 
    }, [storeId]);

    const fetchStoreDetail = async (decodedStoreId) => {
        try {
            const response = await axios.get(`http://localhost:8080/storeDetail`, {
                params: { store: decodedStoreId },
            });
            setStore(response.data);
            setImages(response.data.images || images);
        } catch (error) {
            console.error("가게 정보를 불러오는 중 오류가 발생했습니다:", error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    if (loading) return <p>로딩 중...</p>;
    if (!store) return <p>가게 정보를 불러올 수 없습니다.</p>;

    return (
        <div className="container-fluid p-0 bg-dark text-white" style={{ height: '2000px' }}>
            <header className="header text-center fixed-top bg-dark">
                <div>
                    <ul className='nav justify-content-end'>
                        <nav className='navbar navbar-expand-sm navbar-dark'>
                            <div className="container-fluid fixed-top"> 
                                <Link to ="/"><img src={logo} alt="로고자리" width="50" height="50" />  </Link>    
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
                                    <a onClick={handleLoginOpen} className="nav-link"> 로그인 </a>
                                </li>
                                <li className="nav-item">
                                    <a onClick={handleSignupOpen} className="nav-link">회원가입</a>
                                </li>
                            </>
                        )}
                    </ul>
                    <div className="container-fluid input-group mt-3 mb-3" style={{ margin: '0 30vw', width: '40vw' }}>
                        <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" style={{backgroundColor:'red'}}>지역 선택</button>
                        <ul className="dropdown-menu" style={{ width: '200px' }}>
                            <li><a className="dropdown-item" href="#">강남구</a></li>
                            <li><a className="dropdown-item" href="#">강동구</a></li>
                            <li><a className="dropdown-item" href="#">강서구</a></li>
                            <li><a className="dropdown-item" href="#">양천구</a></li>
                            <li><a className="dropdown-item" href="#">마포구</a></li>
                            <li><a className="dropdown-item" href="#">종로구</a></li>
                        </ul>
                        <input type="text" className="form-control s9-3" placeholder="오늘 뭐 먹지?" />
                        <button type="button" className="btn btn-primary" style={{ flex: 0.4, backgroundColor: 'red', border: 'red' }}>검색</button>
                    </div>
                    <br />
                    <h1>{store.title}</h1>
                    <h5>{store.address}</h5> 
                    <p>{store.description}</p>
                </div>
            </header>

            <div className="image-section" style={{ border: '1px solid white', padding: '0px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {images.map((image, index) => (
                    <img key={index} src={image} alt={`식당 이미지 ${index + 1}`} style={{ width: 'calc(20% - 10px)', margin: '5px', objectFit: 'cover' }} />
                ))}
            </div>
            <br />
            <div className='store-info' style={{border:'solid 1px white'}}> 
                <h4>둘이 먹다가 하나가 죽어도 모를 맛</h4>
                <div className="menu-section">
                    <h2>메뉴 목록</h2>
                    <ul>
                        {store.menu && store.menu.map((item, idx) => (
                            <li key={idx}>{item.name} - {item.price}원</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div><Dids address={store.address} userId={user ? user.userId : null}  /></div>
            
            <div className="map-section" style={{ border: '1px solid black', padding: '10px', margin: '20px 0' }}>
                <KakaoMap location={{ latitude: store.lat, longitude: store.lng }}/>
            </div>

            {/* ReviewSection에 address 전달 */}
            <ReviewSection address={store.address} title={store.title} category={store.category}/>
            
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

export default DetailPage;
