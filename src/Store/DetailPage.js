//DetailPage.js

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './DetailPage.css';
import KakaoMap from '../components/KakaoMap';
import ReviewSection from '../MyPage/ReviewSection';
import Dids from '../MyPage/Dids';
import Signup from '../MyPage/Signup';


const DetailPage = () => {
    const { area } = useParams();
    const { storeId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [store, setStore] = useState(null);
    const [images, setImages] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [areaNm, setAreaNm] = useState('전체');
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

    if (loading) return <p>로딩 중입니다...</p>;
    if (!store) return <p>가게 정보를 불러올 수 없습니다.</p>;

      //검색 버튼 눌렀을 때!
  const handleSearch = () => {
    if(keyword === ""){
      alert("검색어를 입력해주세요");
    }else {
      navigate("/search?areaNm=" + [areaNm] + "&" + "keyword=" + [keyword]);
    };
  } 
  // 엔터키 눌렀을 때!
    const onSubmitSearch = (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };


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
                <div className='col-4'>
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
          </div>
        </header>  
        {/* 이미지 들어갈 곳 */}
          <div className='imgBox'>
            <div>
                {images.map((image, index) => (
                    <img key={index} src={image} alt={`식당 이미지 ${index + 1}`} style={{ width: 'calc(20% - 10px)', margin: '5px', objectFit: 'cover' }} />
                ))}
            </div>
            </div>
          <div>
            <div className='info' style={{textAlign:'center'}}>
                <h2>{store.title}</h2>
                <h3>{store.address}</h3> 
                <p3>{store.description}</p3>
            </div>
          </div>
            {/* <div><Dids address={store.address} userId={user ? user.userId : null}  /></div> */}
            
        <div className='container-fluid'>
            <div className='row'>
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
                    <KakaoMap location={{ latitude: store.lat, longitude: store.lng }}/>
                  </div>                                       
                </div>
            </div>
        </div>  
            
            <ReviewSection/>
          
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
