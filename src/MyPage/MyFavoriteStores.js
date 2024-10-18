
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

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []); 
 
  useEffect(() => {
    if (!user) return;

    const fetchFavoriteStores = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getDibsByUserId', {
          params: { userId: user.userId },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setFavoriteStores(response.data);
      } catch (error) {
        setError('찜한 가게 목록을 불러오는 중 오류가 발생했습니다.');
      }
    };
    fetchFavoriteStores();
  }, [user]);

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
                <Link to={`/detail/${store.title}`}><img src={store.imgSrc || 'default-image.jpg'} alt={store.title} className="img-fluid" /></Link>
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
