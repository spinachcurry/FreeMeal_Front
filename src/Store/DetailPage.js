//DetailPage.js

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState, useEffect,useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './DetailPage.css';
import KakaoMap from '../components/KakaoMap';
import ReviewSection from '../MyPage/ReviewSection'; 
import Signup from '../MyPage/Signup';
import Shares from '../MyPage/Shares';

 
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

   ////////////////////////////

   //찜하기
   const [dibsCount, setDibsCount] = useState(0);
   const [isDibbed, setIsDibbed] = useState(false);
   const [isShareModalOpen, setIsShareModalOpen] = useState(false);
   
   const reviewSectionRef = useRef(null);

   const fetchDibsCount = async (address) => {
    try {
        const response = await axios.get('http://localhost:8080/count', { params: { address } });
        setDibsCount(response.data);
    } catch (error) {
        console.error("찜 카운트 불러오기 중 오류가 발생했습니다:", error);
    }
}; 
const checkDibsStatus = async (address) => {
    if (!user) return;
    try {
        const response = await axios.get('http://localhost:8080/didCheck', { params: { userId: user.userId, address } });
        setIsDibbed(response.data === "이미 찜한 상태입니다.");
    } catch (error) {
        console.error("찜 상태 확인 중 오류가 발생했습니다:", error);
    }
};

const toggleDibs = async () => {
    if (!user) {
        alert("로그인 후 이용해 주세요.");
        return;
    }
    try {
        const response = await axios.post('http://localhost:8080/toggleDibs', null, {
            params: {
                userId: user.userId,
                address: store.address,
                didStatus: isDibbed ? 0 : 1
            }
        });
        if (response.status === 200) {
            setIsDibbed(!isDibbed);
            setDibsCount(isDibbed ? dibsCount - 1 : dibsCount + 1);
        }
    } catch (error) {
        console.error("찜 상태 변경 중 오류가 발생했습니다:", error);
    }
};

const openShareModal = () => setIsShareModalOpen(true);
const closeShareModal = () => setIsShareModalOpen(false);
const scrollToReview = () => reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth' });

if (loading || !store) {
    return <div>로딩 중...</div>;
} 
    return (

        <div className="container-fluid p-0 bg-dark text-white" style={{ height: '1500px' }}>
            <div className='header '>
                <h1><a href='/'></a></h1>
            </div>
            
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark fixed-top" style={{borderBottom:'1px solid white'}}>
                <div className='container-fluid'>

                    <h1 className='header'>
                        <a className='logo' href='/'>
                            <img src={`${process.env.PUBLIC_URL}/img/newlogo.png`} alt='로고'/>
                        </a>
                    </h1>
                    
                    <div className="input">
                        <input type="text" className="form-control s9-3" placeholder="음식, 지역, 매장" style={{ width:'30vw' }} />
                        <button type="button" className="btn btn-danger">
                            <img src={`${process.env.PUBLIC_URL}/img/search_white7.png`} style={{width: '20px'}}></img>
                            <span style={{margin:'5px'}}>찾기</span>
                        </button>
                    </div>
                    <div>
                    <ul className='nav justify-content-end'>
                        {user ? (
                        <li className="nav-item">
                            <p className="nav-link" style={{ color: 'white', fontWeight: '1000' }}>
                            환영합니다, <Link to="/myPage" style={{ color: 'white' }}>{user.userId}</Link>님 
                            <a onClick={handleLogout} className="btn btn-primary"> 로그아웃</a> 
                            </p> 
                        </li> ) : (
                        <>
                            <li className="nav-item" style={{listStyle:'none'}}>
                            <a onClick={handleLoginOpen} className="nav-link">로그인</a>
                            </li>
                            <li className="nav-item" style={{listStyle:'none'}}>
                            <a onClick={handleSignupOpen} className="nav-link">회원가입</a>
                            </li>
                        </>
                        )}
                        {isSignupOpen && <Signup onClose={handleSignupClose} />}
                    </ul>
                    </div>
                </div>
            </nav>
            <div className="image-section" style={{ border: '1px solid white', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {images.map((image, index) => (
                    <img key={index} src={image} alt={`식당 이미지 ${index + 1}`} style={{ width: 'calc(20% - 10px)', margin: '5px', objectFit: 'cover' }} />
                ))}
            </div>
                <div className='info' style={{textAlign:'center'}}>
                    <h2>{store.title}</h2>
                    <h3>{store.address}</h3> 
                    <p3>{store.description}</p3>
                    <img src='/img/bg_ico_s_like.png' alt=""/> {dibsCount}
                </div>   
            
{/* / 찜하기/리뷰로 가기/공유하기/ */}
            <div className="dibs-container"style={{padding:'10px 10px'}}>
                <button className='btn btn-light' onClick={toggleDibs}>
                    {isDibbed ? "찜하기" : "찜하기"}
                </button>
                <button className='btn btn-light' onClick={scrollToReview}>리뷰보기</button>
                <button className='btn btn-light' onClick={openShareModal}>공유하기</button>
            </div>

            {isShareModalOpen && (
                <div className="modal-overlay" onClick={closeShareModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closeShareModal}>X</button>
                        <Shares title={store.title} />
                    </div>
                </div>
            )}
{/* / 찜하기/리뷰로 가기/공유하기/ */} 
            {/* <div><Dids address={store.address} userId={user ? user.userId : null}  /></div> */}
            
        <div className='container-fluid'>
            <div className='row' style={{height:'400px'}}>
                <div className='col-7'>
                    <div className='box'>
                        <div className='info_text'>
                            <table>
                                <tbody>
                                    <tr>
                                    <th><h4>영업시간</h4></th>
                                    <td></td>
                                        <div>
                                           <div className='inline-div'>
                                             <div className='inline-div'>일 11:30 ~ 22:30
                                            </div>
                                             <div className='inline-div'>
                                                <label>월,화,수,목,금,토 11:30 ~ 22:00</label>
                                             </div>
                                            </div> 
                                        </div>
                                    </tr>
                                    <tr>
                                    <th><h4>주차</h4></th>
                                    <td></td>
                                        <div>
                                           <div className='inline-div'>
                                             <div className='inline-div'>주차, 발렛</div>
                                            </div> 
                                        </div>
                                    </tr>
                                    <tr>
                                    <th><h4>메뉴</h4></th>
                                    <td></td>
                                        <div>
                                           <div className='inline-div'>
                                             <div className='inline-div'>(1인)코스(※설명 확인必)
                                            </div>
                                             <div className='inline-div'>
                                                <label>180,000원</label>
                                             </div>
                                            </div> 
                                        </div>
                                    </tr>
                                    <tr>
                                    <th><h4>주소</h4></th>
                                    <td></td>
                                        <div>
                                           <div className='inline-div'>
                                             <div className='inline-div'>서울특별시 강남구 영동대로 142길 13-3</div>
                                                <span>지번</span>
                                             <div className='inline-div'>
                                                <label>서울특별시 강남구 청담동 130-13</label>
                                             </div>
                                            </div> 
                                        </div>
                                    </tr>
                                    <tr>
                                    <th><h4>전화번호</h4></th>
                                    <td></td>
                                        <div>
                                           <div className='inline-div'>
                                             <div className='inline-div'>02-543-2987</div>
                                                <span>지번</span>
                                            </div> 
                                        </div>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-5" >
                  <div className='box' style={{overflow:'hidden'}}>                    
                    <KakaoMap  location={{ latitude: store.lat, longitude: store.lng }}/>
                  </div>                                       
                </div>
            </div>
        </div>  
            
        <ReviewSection ref={reviewSectionRef} address={store.address} title={store.title} category={store.category}/>

          
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
