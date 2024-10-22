import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './DetailPage.css'; 
import KakaoMap from '../components/KakaoMap';
import ReviewSection from '../MyPage/ReviewSection'; 
import Signup from '../MyPage/Signup';
import Shares from '../MyPage/Shares';

const DetailPage = () => {
    const { area, storeId } = useParams();
    const navigate = useNavigate();

    // 상태 관리
    const [user, setUser] = useState(null);
    const [store, setStore] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSignupOpen, setSignupModalOpen] = useState(false);
    const [dibsCount, setDibsCount] = useState(0); // 찜 카운트 상태
    const [isDibbed, setIsDibbed] = useState(false); // 찜 상태
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    // 로그인/회원가입 모달 처리
    const handleSignupOpen = () => setSignupModalOpen(true);
    const handleSignupClose = () => setSignupModalOpen(false);
    const handleLoginOpen = () => navigate('/login');
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('jwtToken');
    };

    // 사용자의 로그인 정보를 로컬 스토리지에서 불러옴
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // 스토어 상세 정보 및 찜 상태 확인
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
            setImages(response.data.images || []);
            
            // 가게 정보를 가져온 후 찜 상태와 찜 카운트를 가져옴
            if (response.data && response.data.address) {
                fetchDibsCount(response.data.address);
                checkUserDibs(response.data.address);
            }

        } catch (error) {
            console.error("가게 정보를 불러오는 중 오류가 발생했습니다:", error);
        } finally {
            setLoading(false);
        }
    }; 
    // 찜 카운트를 가져오는 함수
    const fetchDibsCount = async (address) => {
        try { 
            const response = await axios.post('http://localhost:8080/mypage/handleDibs', { 
                action: "count",
                address: address
        });
            setDibsCount(response.data); 
        } catch (error) {
            console.error("찜 카운트 불러오기 중 오류가 발생했습니다:", error);
            alert(`찜 카운트 불러오기 중 오류가 발생했습니다: ${error}`);
        }
    }; 
  // 사용자가 이미 찜한 상태인지 확인하는 함수
const checkUserDibs = async (address) => {
    if (!user) return;

    try {
        const response = await axios.post('http://localhost:8080/mypage/handleDibs', { 
                action: "check",
                userId: user.userId,
                address: address 
        });

        // 서버 응답을 통해 상태를 확인 (1: 이미 찜한 상태, 0: 찜하지 않은 상태)
        if (response.data === 1) {
            setIsDibbed(true);  // 이미 찜한 상태
        } else if (response.data === 0) {
            setIsDibbed(false);  // 찜하지 않은 상태
        }
    } catch (error) {
        console.error("사용자의 찜 상태 확인 중 오류가 발생했습니다:", error);
    }
};

// 찜하기 토글 함수
const toggleDibs = async () => {
    if (!user) {
        alert("로그인 후 이용해 주세요.");
        return;
    }

    try {
        // checkUserDibs로 현재 상태를 먼저 확인
        const dibStatus = await checkUserDibs(store.address);

        // 현재 상태에 따라 찜 상태를 변경
        const didStatus = isDibbed ? 0 : 1;

        // 서버로 찜 상태를 전송
        const response = await axios.post('http://localhost:8080/mypage/handleDibs', { 
                action: "toggle",
                userId: user.userId,
                address: store.address,
                didStatus: didStatus 
        });

        // 응답에 따라 UI 업데이트
        if (response.status === 200) {
            if (isDibbed) {
                setDibsCount(dibsCount - 1);  // 찜 해제
            } else {
                setDibsCount(dibsCount + 1);  // 찜 추가
            }
            setIsDibbed(!isDibbed);  // 상태 토글
        } else {
            alert("서버로부터 예상치 못한 응답을 받았습니다.");
        }
    } catch (error) {
        console.error("찜 상태 변경 중 오류가 발생했습니다:", error);
        alert("찜 상태 변경 중 오류가 발생했습니다.");
    }
};

// useEffect로 페이지 로드 시 찜 상태 확인
useEffect(() => {
    if (store?.address) {
        checkUserDibs(store.address).then((dibStatus) => {
            if (dibStatus === 1) {
                setIsDibbed(true); // 찜한 상태
            } else if (dibStatus === 0) {
                setIsDibbed(false); // 찜하지 않은 상태
            }
        });
    }
}, [store]);  

    const openShareModal = () => setIsShareModalOpen(true);
    const closeShareModal = () => setIsShareModalOpen(false);

    // 리뷰 섹션으로 스크롤 이동
    const reviewSectionRef = useRef(null);
    const scrollToReview = () => {
        if (reviewSectionRef.current) {
            reviewSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error("reviewSectionRef가 초기화되지 않았습니다.");
        }
    };

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

            {/* 이미지 섹션 */}
            <div className="image-section" style={{ border: '1px solid white', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {images.map((image, index) => (
                    <img key={index} src={image} alt={`식당 이미지 ${index + 1}`} style={{ width: 'calc(20% - 10px)', margin: '5px', objectFit: 'cover' }} />
                ))}
            </div>

            {/* 가게 정보 */}
            <div className='info' style={{textAlign:'center'}}>
                <h2>{store.title}</h2>
                <h3>{store.address}</h3> 
                <p>{store.description}</p>
                <img src='/img/bg_ico_s_like.png' alt=""/> {dibsCount}
            </div>

            {/* 찜하기, 리뷰 보기, 공유하기 버튼 */}
            <div className="dibs-container" style={{ display: 'flex', alignItems: 'center', padding: '10px 10px' }} >
                <button className='btn btn-light' onClick={toggleDibs}>
                    {isDibbed ? "찜하기" : "찜하기"} 
                </button>
                <button className='btn btn-light' onClick={scrollToReview}>리뷰보기</button>  
                <Shares className='btn btn-light' areaNm={store.areaNm} title={store.title} />
            </div>  
            {/* 찜하기, 리뷰 보기, 공유하기 버튼 */}

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
              
        <ReviewSection ref={reviewSectionRef}  address={store.address} title={store.title} category={store.category}/>

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