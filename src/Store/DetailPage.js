import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DetailPage.css';  
import ReviewSection from '../MyPage/Componets/ReviewSection';  
import Shares from '../MyPage/Componets/Shares';
import Menu from '../MyPage/Componets/Menu';
import MyTap from '../MyPage/Componets/MyTap';

const DetailPage = () => {
    const { area, storeId } = useParams();
    const navigate = useNavigate();

    const [store, setStore] = useState(null);
    const [images, setImages] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [areaNm, setAreaNm] = useState('전체');
    const [loading, setLoading] = useState(true);
    const [dibsCount, setDibsCount] = useState(0); // 찜 카운트 상태
    const [isDibbed, setIsDibbed] = useState(false); // 찜 상태
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const reviewSectionRef = useRef(null);

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

    const checkUserDibs = async (address) => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) return;

            const user = JSON.parse(storedUser);
            const response = await axios.post('http://localhost:8080/mypage/handleDibs', { 
                action: "check",
                userId: user.userId,
                address: address 
            });

            if (response.data === 1) {
                setIsDibbed(true);
            } else if (response.data === 0) {
                setIsDibbed(false);
            }
        } catch (error) {
            console.error("사용자의 찜 상태 확인 중 오류가 발생했습니다:", error);
        }
    };

    const toggleDibs = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                alert("로그인 후 이용해 주세요.");
                return;
            }

            const user = JSON.parse(storedUser);
            const didStatus = isDibbed ? 0 : 1;

            const response = await axios.post('http://localhost:8080/mypage/handleDibs', { 
                action: "toggle",
                userId: user.userId,
                address: store.address,
                didStatus: didStatus 
            });

            if (response.status === 200) {
                if (isDibbed) {
                    setDibsCount(dibsCount - 1);
                } else {
                    setDibsCount(dibsCount + 1);
                }
                setIsDibbed(!isDibbed);
            } else {
                alert("서버로부터 예상치 못한 응답을 받았습니다.");
            }
        } catch (error) {
            console.error("찜 상태 변경 중 오류가 발생했습니다:", error);
            alert("찜 상태 변경 중 오류가 발생했습니다.");
        }
    };

    const onSubmitSearch = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleSearch = () => {
        if (keyword === "") {
            alert("검색어를 입력해주세요");
        } else {
            navigate("/search?areaNm=" + [areaNm] + "&" + "keyword=" + [keyword]);
        };
    };

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
            <header className='header'>
                <div className='container-fluid'>
                    <div className='row' style={{borderBottom:'1px solid white'}}>
                        <a className='logo col-1' href='/'>
                            <img src={`${process.env.PUBLIC_URL}/img/newlogo.png`} alt='로고' />
                        </a>
                        <div className='col-4' style={{marginTop:'5px'}}>
                            <div className="container-fluid input-group" style={{width:'30vw', marginLeft:'0', marginRight:'0', height:'20px'}} >
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
                        <MyTap /> {/* MyTap 컴포넌트 사용 */}
                    </div>
                </div>
            </header>
             
            <div className='imgBox'>
                <div>
                    {images.map((image, index) => (
                        <img key={index} src={image} alt={`식당 이미지 ${index + 1}`} style={{ width: 'calc(20% - 10px)', margin: '5px', objectFit: 'cover' }} />
                    ))}
                </div>
                <div className='info' style={{textAlign:'center'}}>
                    <h2>{store.title}</h2>
                    <h3>{store.address}</h3>
                    <p>{store.description}</p>
                    <img src='/img/bg_ico_s_like.png' alt=""/> {dibsCount}
                </div>
                <div className="dibs-container" style={{ display: 'flex', alignItems: 'center', padding: '0px 35px' }}>
                    <button className='btn btn-light' onClick={toggleDibs}>
                        {isDibbed ? "찜하기" : "찜하기"} 
                    </button>
                    <button className='btn btn-light' onClick={scrollToReview}>리뷰보기</button>  
                    <Shares className='btn btn-light' areaNm={store.areaNm} title={store.title} />
                </div> 
            </div>
            
            {/* 메뉴 및 리뷰 섹션 */} 
            <Menu address={store.address} location={{ latitude: store.lat, longitude: store.lng }} />
            <ReviewSection ref={reviewSectionRef} address={store.address} title={store.title} category={store.category}/>

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

export default DetailPage;
