import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'swiper/swiper-bundle.css';
import './DetailPage.css';
import KakaoMap from '../components/KakaoMap';
import ReviewSection from '../MyPage/ReviewSection';
import Dids from '../MyPage/Dids';

const DetailPage = () => {
    const { area } = useParams();
    const { storeId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [store, setStore] = useState(null);
    const [images, setImages] = useState([
       
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

    if (loading) return <p>로딩 중입니다...</p>;
    if (!store) return <p>가게 정보를 불러올 수 없습니다.</p>;

    return (



        <div className="container-fluid p-0 bg-dark text-white" style={{ height: '2000px' }}>
            <header className="header text-center bg-dark">
                <div>
                    <ul className='nav justify-content-end'>
                        <nav className='navbar navbar-expand-sm bg-dark navbar-dark fixed-top'>
                            <div className='container-fluid'>
                                <a className='navbar-brand' href="/">
                                <img src={`${process.env.PUBLIC_URL}/img/logo.jpg`} style={{width:'35px'}} alt='로고자리'/> 
                                </a>
                            </div>
                        </nav>
                        {user ? (
                            <li className="nav-item ">
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
                    <div className="container-fluid input-group mt-3" style={{ margin: '0 30vw', flex:'0.5', width: '40vw' }}>
                        <select className="form-select" aria-label="지역 선택" style={{ textAlign:'center', backgroundColor: 'red', color: 'white', border:'none' }}>
                        <option value="" style={{ backgroundColor:'white', color:'black' }}>지역 선택</option>
                        <option value="강남구" style={{backgroundColor:'white', color:'black'}}>강남구</option>
                            <option value="강동구" style={{backgroundColor:'white', color:'black'}}>강동구</option>
                            <option value="강서구" style={{backgroundColor:'white', color:'black'}}>강서구</option>
                            <option value="양천구" style={{backgroundColor:'white', color:'black'}}>양천구</option>
                            <option value="마포구" style={{backgroundColor:'white', color:'black'}}>마포구</option>
                            <option value="종로구" style={{backgroundColor:'white', color:'black'}}>종로구</option>

                        </select>
                        <input type="text" className="form-control s9-3" placeholder="오늘 뭐 먹지?" style={{ width:'15vw' }} />
                        <button type="button" className="btn btn-danger btn-sm" style={{ flex: 0.5, backgroundColor: 'red', border: 'red' }}>검색</button>
                    </div>
                    <br></br>
                </div>
            </header>
            

            <div className="image-section" style={{ border: '5px solid gray', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {images.map((image, index) => (
                    <img key={index} src={image} alt={`식당 이미지 ${index + 1}`} style={{ width: 'calc(20% - 10px)', margin: '5px', objectFit: 'cover' }} />
                ))}
            </div>
                <div className='info' style={{textAlign:'center'}}>
                    <h2>{store.title}</h2>
                    <h3>{store.address}</h3> 
                    <p3>{store.description}</p3>
                </div>   
            
            <div className='store-info'> 
                <div className="menu-section">
                    <ul>
                        {store.menu && store.menu.map((item, idx) => (
                            <li key={idx}>{item.name} - {item.price}원</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div><Dids address={store.address} userId={user ? user.userId : null}  /></div>
            
            <div className="map-section" style={{ border: '1px solid gray', padding: '10px', margin: '20px 0' }}>
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
