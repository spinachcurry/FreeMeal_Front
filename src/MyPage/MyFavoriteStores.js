import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Store/MainPage.css';

const MyFavoriteStores = () => {
  const [user, setUser] = useState(null); 
  const [favoriteStores, setFavoriteStores] = useState([]);
  const [error, setError] = useState(null);

  // 로컬 스토리지에서 사용자 정보 불러오기
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []); 
 
  // 찜한 가게 목록 불러오기
  useEffect(() => {
    if (!user) return;

    const fetchFavoriteStores = async () => {
      try {
        const response = await axios.post('http://localhost:8080/mypage/handleDibs', {
          action: 'list', // 'list' 액션을 보냅니다
          userId: user.userId
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        
        setFavoriteStores(response.data); // 서버로부터 받은 데이터를 상태에 저장
      } catch (error) {
        setError('찜한 가게 목록을 불러오는 중 오류가 발생했습니다.');
      }
    };
    
    fetchFavoriteStores();
  }, [user]);

  // 사용자 로그인 여부 확인
  if (!user) {
    return <p>로그인이 필요합니다.</p>;
  }

  return (
    <div className="container">
      <h2 style={{color:'white'}}>나의 찜 목록 </h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      
      {favoriteStores.length > 0 ? (
        <Swiper modules={[Navigation, Pagination]} spaceBetween={30} slidesPerView={3} navigation className="swiper-container">
          {favoriteStores.map((store, index) => (
            <SwiperSlide key={index} className="swiper-slide">
              <div className="restaurant-item"> 
                <Link to={`/detail/${store.areaNm}/${store.title}`}style={{ color: 'white', textDecoration: 'none' }}> 
                  <img src={store.imgSrc || 'default-image.jpg'} alt={store.title} className="img-fluid" />
                </Link>
                <h3 style={{color:'white'}}>{store.title}</h3>
                <p> {store.category}</p>
                <p>{store.address}</p> 
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>찜한 가게가 없습니다.</p>
      )}

    </div>
  );
};

export default MyFavoriteStores;